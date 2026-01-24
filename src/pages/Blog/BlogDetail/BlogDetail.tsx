import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MarkdownRender from "@/components/MarkdownRender/MarkdownRender";
import { pathToTitleMap } from "@/pages/Blog/constants";

export default function MarkdownFetcher(): React.ReactElement {
    const params = useParams<{ path: string }>();
    const [markdown, setMarkdown] = useState<string>("");

    useEffect(() => {
        const loadBlog = async (path: string | undefined) => {
            if (!path) return;

            try {
                const response = await fetch(
                    `https://obj-storage-1304785445.shiqihao.xyz/blog/${path}.md`
                );
                const body = await response.text();
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
