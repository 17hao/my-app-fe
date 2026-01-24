import LogOut from "modules/account/LogOut";
import "./XssAttackDemo.css";

export default function XssAttackDemo() {
    return (
        <div className="xss-demo-container">
            <div className="xss-demo-title">
                ⚔️ XSS攻击演示
            </div>
            <div className="xss-demo-content">
                <div className="xss-demo-warning">
                    ⚠️ 警告：本页面仅用于教育目的，请勿在生产环境中使用类似代码
                </div>
                <div className="xss-demo-section">
                    <h3>什么是XSS攻击？</h3>
                    <p className="xss-demo-description">
                        跨站脚本攻击（Cross-Site Scripting，XSS）是一种网络安全漏洞，
                        攻击者通过在网页中注入恶意脚本，当其他用户浏览该页面时，
                        恶意脚本会在用户的浏览器中执行，从而窃取用户信息或执行其他恶意操作。
                    </p>
                </div>
                <div className="xss-demo-section">
                    <h3>防护措施</h3>
                    <p className="xss-demo-description">
                        • 对用户输入进行严格的验证和过滤<br/>
                        • 使用CSP（内容安全策略）<br/>
                        • 对输出内容进行转义<br/>
                        • 使用现代框架的内置XSS防护机制
                    </p>
                </div>
                <div className="xss-demo-logout">
                    <LogOut />
                </div>
            </div>
        </div>
    );
};
