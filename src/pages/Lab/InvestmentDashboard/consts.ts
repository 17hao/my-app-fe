// 平台：value 用于请求体，label 用于下拉展示
export const PLATFORM_OPTIONS = [
    { value: "cmb", label: "招商银行" },
    { value: "yinhe", label: "银河证券" },
    { value: "pingan", label: "平安证券" },
    { value: "usmart_sg", label: "盈立证券sg" },
    { value: "za_bank", label: "众安银行" },
    { value: "ibkr", label: "盈透证券" },
    { value: "hsbc", label: "汇丰银行" },
    { value: "schwab", label: "嘉信理财" },
];

// 操作类型
export const OP_TYPE_OPTIONS = [
    { value: "buy", label: "买入" },
    { value: "sell", label: "卖出" },
];

// 一级分类：value 用英文 code，label 用中文
export const OP_ITEM_L1_TYPE_OPTIONS = [
    { value: "usTreasury", label: "美国国债" },
    { value: "otherBonds", label: "其他债券" },
    { value: "usStock", label: "美股" },
    { value: "globalStock", label: "全球股市" },
    { value: "gold", label: "黄金" },
    { value: "commodity", label: "大宗商品" },
];

// 二级分类：按一级分类 code 分组，value 用于请求体，label 用于展示
export const OP_ITEM_L2_TYPE_OPTIONS: Record<string, Array<{ value: string; label: string }>> = {
    usTreasury: [
        { value: "shortTerm", label: "短期国债（0-1Y）" },
        { value: "intermediateTerm", label: "中期国债（1-10Y）" },
        { value: "longTerm", label: "长期国债（20Y+）" },
    ],
    otherBonds: [
        { value: "usCorporateBond", label: "美国企业债" },
        { value: "cnBalancedBond", label: "中国混合债" },
    ],
    usStock: [
        { value: "sp500", label: "sp500" },
        { value: "ndx100", label: "ndx100" },
        { value: "crsp_us_total_market", label: "CRSP US Total Market" },
    ],
    globalStock: [
        { value: "aShares", label: "A股" },
        { value: "hkStock", label: "港股" },
        { value: "ftse100", label: "英国ftse100" },
        { value: "nikkei225", label: "日本nikkei225" },
        { value: "cac40", label: "法国cac40" },
        { value: "dax", label: "德国dax" },
    ],
};

export const cny = "CNY";
export const hkd = "HKD";
export const usd = "USD";