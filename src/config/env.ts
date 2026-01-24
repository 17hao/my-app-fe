/**
 * 环境配置工具
 * 统一管理环境变量的访问
 */

export const ENV = {
    // 是否为生产环境
    isProd: import.meta.env.PROD,

    // 是否为开发环境
    isDev: import.meta.env.DEV,

    // 自定义环境变量
    APP_ENV: import.meta.env.VITE_APP_ENV,
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    DEBUG: import.meta.env.VITE_APP_DEBUG === 'true',
} as const;

/**
 * 获取 API 完整路径
 * @param path API 路径
 * @returns 完整的 API URL
 */
export function getApiUrl(path: string): string {
    const baseUrl = ENV.API_BASE_URL || '';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
}

/**
 * 日志工具 - 仅在开发环境或 DEBUG 模式下输出
 */
export const logger = {
    log: (...args: any[]) => {
        if (ENV.DEBUG || ENV.isDev) {
            console.log('[APP]', ...args);
        }
    },
    error: (...args: any[]) => {
        if (ENV.DEBUG || ENV.isDev) {
            console.error('[APP ERROR]', ...args);
        }
    },
    warn: (...args: any[]) => {
        if (ENV.DEBUG || ENV.isDev) {
            console.warn('[APP WARN]', ...args);
        }
    },
    info: (...args: any[]) => {
        if (ENV.DEBUG || ENV.isDev) {
            console.info('[APP INFO]', ...args);
        }
    },
};

// 在开发环境下打印环境信息
if (ENV.isDev) {
    console.log('=== 环境配置 ===');
    console.log('APP_ENV:', ENV.APP_ENV);
    console.log('API_BASE_URL:', ENV.API_BASE_URL);
    console.log('DEBUG:', ENV.DEBUG);
    console.log('================');
}
