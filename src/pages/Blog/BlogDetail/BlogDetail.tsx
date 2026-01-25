import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MarkdownRender from "@/components/MarkdownRender/MarkdownRender";
import { pathToTitleMap } from "@/pages/Blog/constants";
import { ENV } from "@/config/env";

export default function MarkdownFetcher(): React.ReactElement {
    const params = useParams<{ path: string }>();
    const [markdown, setMarkdown] = useState<string>("");

    useEffect(() => {
        const loadBlog = async (path: string | undefined) => {
            if (!path) return;

            try {
                let body: string;
                
                if (ENV.isDev) {
                    // 开发环境：从本地 assets 目录加载
                    const module = await import(`@/assets/blogs/${path}.md?raw`);
                    body = module.default;
                } else {
                    // 生产环境：从远程服务器获取
                    const response = await fetch(
                        `https://obj-storage-1304785445.shiqihao.xyz/blog/${path}.md`
                    );
                    body = await response.text();
                }
                
                setMarkdown(body);
            } catch (e) {
                console.error("Failed to fetch markdown:", e);
                setMarkdown("# 读取内容失败");
            }
        };

        loadBlog(params.path);
    }, [params.path]);

    // 从 map 中获取标题，如果没有对应值就用 path 本身
    const title = params.path ? pathToTitleMap.get(params.path) || params.path : "未命名文档";

    return <MarkdownRender title={title} markdown={markdown} />;
}
