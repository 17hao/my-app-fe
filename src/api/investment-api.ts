import { getApiUrl } from '../config/env';

export interface ItemCostDetail {
    l1Type: string;
    l2Type: string;
    amount: number;
    percent: number;
}

export interface PlatformCostDetail {
    opPlatform: string;
    amount: number;
    percent: number;
}

export interface InvestmentCostResponse {
    code: string;
    message: string;
    data: {
        itemCostDetails: ItemCostDetail[];
        platformCostDetails: PlatformCostDetail[];
    };
}

/**
 * 获取投资成本分析数据
 */
export async function fetchInvestmentCostAnalysis(): Promise<InvestmentCostResponse> {
    const response = await fetch(getApiUrl('/investment/analyze/cost'));
    if (!response.ok) {
        throw new Error(`Failed to fetch investment cost analysis: ${response.statusText}`);
    }
    return response.json();
}
