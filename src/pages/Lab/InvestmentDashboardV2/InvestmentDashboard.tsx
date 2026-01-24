import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { fetchInvestmentCostAnalysis, ItemCostDetail, PlatformCostDetail } from "@/api/investment-api";
import styles from "./InvestmentDashboard.module.css";

// 颜色配置
const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8",
    "#82CA9D", "#FFC658", "#FF6B9D", "#C23A89", "#5B9BD5"
];

// 类型名称映射
const TYPE_NAME_MAP: Record<string, string> = {
    "usTreasury": "美国国债",
    "otherBonds": "其他债券",
    "usStock": "美股",
    "globalStock": "全球股市",
    "commodity": "大宗商品",
    "gold": "黄金",
    "shortTerm": "短期国债（0-1Y）",
    "intermediateTerm": "中期国债（1-10Y）",
    "longTerm": "长期国债（20Y+）",
    "usCorporateBond": "美元企业债",
    "cnMixedBond": "人民币债股混合",
    "sp500": "SP500",
    "ndx100": "NDX100",
    "crsp_us_total_market": "CRSP US Total Market",
    "aShares": "A股",
    "hkStock": "港股",
    "ftse100": "英国ftse100",
    "nikkei225": "日本nikkei225",
    "cac40": "法国cac40",
    "dax": "德国dax",

};

// 平台名称映射
const PLATFORM_NAME_MAP: Record<string, string> = {
    "cmb": "招商银行",
    "yinhe": "银河证券",
    "pingan": "平安证券",
    "usmart_sg": "盈立证券",
    "za_bank": "众安银行",
    "ibkr": "盈透证券",
    "hsbc": "汇丰银行",
    "schwab": "嘉信理财",
};

interface InvestmentDashboardProps { }

export default function InvestmentDashboard({ }: InvestmentDashboardProps) {
    const [itemCostDetails, setItemCostDetails] = useState<ItemCostDetail[]>([]);
    const [platformCostDetails, setPlatformCostDetails] = useState<PlatformCostDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedL1Type, setSelectedL1Type] = useState<string>("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await fetchInvestmentCostAnalysis();
            if (response.code === "0") {
                setItemCostDetails(response.data.itemCostDetails);
                setPlatformCostDetails(response.data.platformCostDetails);
            } else {
                setError(response.message || "加载数据失败");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "加载数据失败");
        } finally {
            setLoading(false);
        }
    };

    // 按一级分类汇总数据
    const aggregateByL1Type = () => {
        const aggregated = new Map<string, { amount: number; percent: number }>();

        itemCostDetails.forEach(item => {
            if (aggregated.has(item.l1Type)) {
                const existing = aggregated.get(item.l1Type)!;
                existing.amount += item.amount;
                existing.percent += item.percent;
            } else {
                aggregated.set(item.l1Type, { amount: item.amount, percent: item.percent });
            }
        });

        return Array.from(aggregated.entries())
            .map(([l1Type, data]) => ({
                name: TYPE_NAME_MAP[l1Type] || l1Type,
                value: data.amount,
                percent: data.percent,
                l1Type: l1Type,
            }))
            .sort((a, b) => b.percent - a.percent); // 按比例降序排序
    };

    // 转换平台数据
    const transformPlatformData = () => {
        return platformCostDetails
            .map(item => ({
                name: PLATFORM_NAME_MAP[item.opPlatform] || item.opPlatform,
                value: item.amount,
                percent: item.percent,
            }))
            .sort((a, b) => b.percent - a.percent); // 按比例降序排序
    };

    // 获取指定一级分类的二级分类数据
    const getL2DetailsByL1Type = (l1Type: string) => {
        return itemCostDetails
            .filter(item => item.l1Type === l1Type)
            .map(item => ({
                name: TYPE_NAME_MAP[item.l2Type] || item.l2Type,
                amount: item.amount,
                percent: item.percent,
            }));
    };

    // 自定义图例点击处理
    const handleLegendClick = (data: any) => {
        if (data.l1Type) {
            setSelectedL1Type(data.l1Type);
            setModalVisible(true);
        }
    };

    // 自定义图例渲染
    const renderCustomLegend = (props: any, totalAmount?: number) => {
        const { payload } = props;
        return (
            <div>
                {totalAmount !== undefined && (
                    <div className={styles.legendTotalAmount}>
                        总金额: ¥{totalAmount.toFixed(2)}
                    </div>
                )}
                <ul className={styles.customLegend}>
                    {payload.map((entry: any, index: number) => (
                        <li
                            key={`item-${index}`}
                            className={styles.legendItem}
                            onClick={() => handleLegendClick(entry.payload)}
                            style={{ cursor: entry.payload.l1Type ? "pointer" : "default" }}
                        >
                            <span
                                className={styles.legendIcon}
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className={styles.legendText}>
                                {entry.value}: ¥{entry.payload.value.toFixed(2)} ({entry.payload.percent.toFixed(2)}%)
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    if (loading) {
        return <div className={styles.container}><p>加载中...</p></div>;
    }

    if (error) {
        return <div className={styles.container}><p className={styles.error}>错误: {error}</p></div>;
    }

    const itemData = aggregateByL1Type();
    const platformData = transformPlatformData();
    const l2Details = selectedL1Type ? getL2DetailsByL1Type(selectedL1Type) : [];

    // 计算总金额
    const totalItemAmount = itemData.reduce((sum, item) => sum + item.value, 0);
    const totalPlatformAmount = platformData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className={styles.container}>
            <div className={styles.chartsContainer}>
                {/* 投资对象成本分布图 */}
                <div className={styles.chartSection}>
                    <h2 className={styles.chartTitle}>投资对象成本分布</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={itemData}
                                cx="35%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                isAnimationActive={false}
                            >
                                {itemData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend
                                content={(props) => renderCustomLegend(props, totalItemAmount)}
                                layout="vertical"
                                align="right"
                                verticalAlign="middle"
                                wrapperStyle={{ paddingLeft: "0px" }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <p className={styles.hint}>💡 点击图例查看二级分类详情</p>
                </div>

                {/* 投资平台成本分布图 */}
                <div className={styles.chartSection}>
                    <h2 className={styles.chartTitle}>投资平台成本分布</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={platformData}
                                cx="35%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                isAnimationActive={false}
                            >
                                {platformData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend
                                content={(props) => renderCustomLegend(props, totalPlatformAmount)}
                                layout="vertical"
                                align="right"
                                verticalAlign="middle"
                                wrapperStyle={{ paddingLeft: "0px" }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 二级分类弹窗 */}
            {modalVisible && (
                <div className={styles.modalOverlay} onClick={() => setModalVisible(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>{TYPE_NAME_MAP[selectedL1Type] || selectedL1Type} - 二级分类详情</h3>
                            <button
                                className={styles.closeButton}
                                onClick={() => setModalVisible(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <table className={styles.detailTable}>
                                <thead>
                                    <tr>
                                        <th>分类名称</th>
                                        <th>金额(¥)</th>
                                        <th>比例</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {l2Details.map((detail, index) => (
                                        <tr key={index}>
                                            <td>{detail.name}</td>
                                            <td>¥{detail.amount.toFixed(2)}</td>
                                            <td>{detail.percent.toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
