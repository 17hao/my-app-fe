需求背景：手上有闲置的服务器，希望能通过公网访问。

实现方案分析：
1. 固定IP，成本较高
2. 动态IP，部分运营商可以开通，但是不开放80、443等敏感端口，无法用于个人建站

基于需求和成本的考虑，选择动态IP。

由于IP会发生变化，需要绑定一个固定的域名用于访问服务器。常规的DNS解析中，IP是固定的，那么IP值是动态的DNS解析就是[DDNS](https://www.cloudflare.com/learning/dns/glossary/dynamic-dns/)。


部分路由器会支持第三方DDNS供应商，比如华为路由器支持花生壳，但是需要额外付费，自己动手实现成本更低。

大致步骤：
1. 光猫设置为桥接模式。光猫从此只负责信号转换，连接在光猫后面的路由器负责拨号上网
2. 实现ddns代码
   1. 查询公网ip
   2. 查询dns解析记录
   3. 创建记录或者更新记录
3. 编译后将可执行文件上传至服务器
4. 创建cron任务，定时更新dns解析记录

查询公网IP的方案参考[GitHub仓库](https://github.com/ihmily/ip-info-api)，DNS解析以腾讯云为例，其他云厂商基本原理相同，只需替换API接口。


附上代码：
```go
package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/profile"
	dnspod "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/dnspod/v20210323"
)

const domain = "your-domain"

func getPublicIP() (string, error) {
	const url = "https://api.qjqq.cn/api/Local"
	httpClient := http.Client{}
	httpReq, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return "", errors.Errorf("getPublicIP err=%+v", err)
	}
	httpReq.Header.Add("user-agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36")
	httpResp, err := httpClient.Do(httpReq)
	if err != nil {
		return "", errors.Errorf("getPublicIP err=%+v", err)
	}
	if httpResp.StatusCode != 200 {
		return "", errors.New(fmt.Sprintf("getPublicIP http status code=%d", httpResp.StatusCode))
	}
	scanner := bufio.NewScanner(httpResp.Body)
	bodyBuilder := strings.Builder{}
	for scanner.Scan() {
		bodyBuilder.WriteString(scanner.Text())
	}
	var body struct {
		Code int32  `json:"code"`
		Msg  string `json:"msg"`
		IP   string `json:"ip"`
	}
	err = json.Unmarshal([]byte(bodyBuilder.String()), &body)
	if err != nil {
		return "", errors.Errorf("getPublicIP err=%+v", err)
	}
	if body.Code == 200 {
		return body.IP, nil
	}
	logrus.Warn(body)
	return "", errors.New(fmt.Sprintf("code=%d msg=%s", body.Code, body.Msg))
}

func queryDnsARecord(client *dnspod.Client) (*dnspod.RecordListItem, error) {
	describeRecordListRequest := dnspod.NewDescribeRecordListRequest()
	describeRecordListRequest.Domain = common.StringPtr(domain)
	describeRecordListResp, err := client.DescribeRecordList(describeRecordListRequest)
	if err != nil {
		logrus.Info(describeRecordListResp.ToJsonString())
		return nil, errors.Errorf("DescribeRecordList return err, err=%+v", err)
	}

	if describeRecordListResp.Response == nil {
		return nil, errors.New("describeRecordListResp is empty")
	}

	for _, record := range describeRecordListResp.Response.RecordList {
		if *record.Type == "A" {
			return record, nil
		}
	}
	return nil, nil
}

func createDnsARecord(client *dnspod.Client, publicIP string) error {
	createRecordRequest := dnspod.NewCreateRecordRequest()
	createRecordRequest.Domain = common.StringPtr(domain)
	createRecordRequest.RecordType = common.StringPtr("A")
	createRecordRequest.RecordLine = common.StringPtr("默认")
	createRecordRequest.Value = common.StringPtr(publicIP)
	createRecordResp, err := client.CreateRecord(createRecordRequest)
	if err != nil {
		logrus.Warn(createRecordResp.ToJsonString())
		return errors.Errorf("client.CreateRecord failed, err=%+v", err)
	}
	return nil
}

func updateDnsARecord(client *dnspod.Client, existRecord *dnspod.RecordListItem, publicIP string) error {
	modifyRecordRequest := dnspod.NewModifyRecordRequest()
	modifyRecordRequest.Domain = common.StringPtr(domain)
	modifyRecordRequest.RecordType = existRecord.Type
	modifyRecordRequest.RecordLine = existRecord.Line
	modifyRecordRequest.Value = common.StringPtr(publicIP)
	modifyRecordRequest.RecordId = existRecord.RecordId
	modifyRecordResp, err := client.ModifyRecord(modifyRecordRequest)
	if err != nil {
		logrus.Warn(modifyRecordResp.ToJsonString())
		return errors.Errorf("client.ModifyRecord failed, err=%+v", err)
	}
	return nil
}

func main() {
	// 公网ip查询
	// https://github.com/ihmily/ip-info-api?tab=readme-ov-file
	publicIP, err := getPublicIP()
	if err != nil {
		logrus.Fatalf("getPublicIP return err, err=%+v", err)
	}
	logrus.Infof("publicIP=%s", publicIP)

	credential := common.NewCredential(
		"secretId",
		"secretKey",
	)
	client, err := dnspod.NewClient(credential, "", profile.NewClientProfile())
	if err != nil {
		logrus.Fatalf("init dnspod client faled, err=%+v", err)
	}

	// 获取域名的解析记录列表：https://cloud.tencent.com/document/api/1427/56166
	typeARecord, err := queryDnsARecord(client)
	if err != nil {
		logrus.Fatalf("queryDnsARecord failed, err=%+v", err)
	}

	// 添加记录：https://cloud.tencent.com/document/api/1427/56180
	if typeARecord == nil {
		logrus.Info("createDnsARecord")
		if err := createDnsARecord(client, publicIP); err != nil {
			logrus.Fatalf("craeteDnsARecord failed, err=%+v", err)
		}
	}

	// 更新记录：https://cloud.tencent.com/document/api/1427/56157
	if *typeARecord.Value != publicIP {
		logrus.Info("updateDnsARecord")
		if err := updateDnsARecord(client, typeARecord, publicIP); err != nil {
			logrus.Fatalf("updateDnsARecord failed, err=%+v", err)
		}
	}

	logrus.Info("nothing to do")
}
```

最后在服务器创建cron任务：
```bash
# 打开crontab编辑器
crontab -e

# 添加下面这行，每2分钟更新一次DNS解析记录
*/2 * * * * /home/sqh/.local/bin/tencent_ddns >> /var/log/cron.log 2>&1
```
