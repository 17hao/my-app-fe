jwt 和 oauth2.0 的联系、区别？

oauth是一套协议，定义了客户端如何认证，但没有定义客户端可以从哪里获取什么样的token用于认证。
jwt是token生成方案，是oauth协议中token格式的具体实现。

#=============

jwe 和 jws 的区别？
jwe：json web encryption；jws：json web signature
jws对token进行签名，中间人劫持请求后可以看到内容，但是无法修改，否则签名校验会失败。
jwe对token进行非对称加密，中间人劫持请求后看不到内容，也无法修改。

js jws lib: https://github.com/panva/jose

1. https://stackoverflow.com/questions/33589353/what-are-the-pros-cons-of-using-jwe-or-jws
2. https://stackoverflow.com/a/62095056/9779481

#==============

怎么做用户名、密码校验？

给用户密码添加固定的盐再hash是不推荐的，攻击者可以用[rainbow table](https://en.wikipedia.org/wiki/Rainbow_table)。
正确做法是给每个用户生成一个随机的盐，但是把用户名作为盐也是不推荐的。
可以用high-entropy salt + unique id作为随机的盐，bcrypt是一种方案。
db里存储随机生成的盐和哈希后的值。

1. https://en.wikipedia.org/wiki/Bcrypt
2. https://stackoverflow.com/questions/536584/non-random-salt-for-password-hashes/536756#536756
3. https://security.stackexchange.com/questions/379/what-are-rainbow-tables-and-how-are-they-used
4. https://stackoverflow.com/questions/6832445/how-can-bcrypt-have-built-in-salts

#================

jwt存储在哪里？

cookie不能跨域，authorization http header可以跨域

1. https://github.com/IdentityServer/IdentityServer3/issues/2039#issuecomment-288135399
2. https://www.redotheweb.com/2015/11/09/api-security.html
3. https://stackoverflow.com/questions/44133536/is-it-safe-to-store-a-jwt-in-localstorage-with-reactjs
5. https://stackoverflow.com/a/35347022/9779481
6. https://www.reddit.com/r/Angular2/comments/cubdwa/storing_authentication_tokens_local_storage_or/
7. https://medium.com/@benjamin.botto/secure-access-token-storage-with-single-page-applications-part-1-9536b0021321
8. https://medium.com/@ryanchenkie_40935/react-authentication-how-to-store-jwt-in-a-cookie-346519310e81
   1. 也提到了处理cookie跨域的问题

#================

csrf和jwt之间的联系：https://security.stackexchange.com/questions/170388/do-i-need-csrf-token-if-im-using-bearer-jwt

#================

刷新jwt的流程：

1. https://stackoverflow.com/questions/27726066/jwt-refresh-token-flow
2. https://www.baeldung.com/cs/json-web-token-refresh-token#:~:text=The%20Role%20of%20Refresh%20Tokens&text=These%20long%2Dlived%20tokens%20are,a%20user%20is%20granted%20access.

#================

使用jwt登录、访问资源：https://medium.com/@maison.moa/using-jwt-json-web-tokens-to-authorize-users-and-protect-api-routes-3e04a1453c3e

#================

实现登录相关参考文章：
1. https://medium.com/@stheodorejohn/implementing-automatic-redirects-after-login-in-react-protected-routes-b5bac2056400
2. https://medium.com/@bhairabpatra.iitd/private-routes-in-react-559a7d8d161f
3. https://dev.to/iamandrewluca/private-route-in-react-router-v6-lg5
4. https://stackoverflow.com/questions/69864165/error-privateroute-is-not-a-route-component-all-component-children-of-rou

#================

cors
1. https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe

#================

xhr和fetch的区别：
1. https://stackoverflow.com/questions/35549547/fetch-api-vs-xmlhttprequest


csrf token保存在哪里？
1. https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#storing-the-csrf-token-value-in-the-dom
2. https://stackoverflow.com/questions/20504846/why-is-it-common-to-put-csrf-prevention-tokens-in-cookies
3. https://stackoverflow.com/questions/65854195/csrf-double-submit-cookie-is-basically-not-secure


http only cookie无法通过js设置
1. https://stackoverflow.com/questions/14691654/set-a-cookie-to-httponly-via-javascript


xss 攻击
1. https://shahjerry33.medium.com/xss-the-localstorage-robbery-d5fbf353c6b0
2. https://medium.com/redteam/stealing-jwts-in-localstorage-via-xss-6048d91378a0


飞书有2个csrf token，lgw_csrf_token和swp_csrf_token。
访问feishu.cn时，会请求https://www.feishu.cn/lgw/csrf_token，在reponse cookie中携带lgw_csrf_token（httpOnly==false && secure==true）
登录后会发起csrf token请求获取新的swp_csrf_token，下次请求时更新request cookie中的swp_csrf_token。


目前的方案：
用于用户身份认证的session token存储在http only && secure的cookie里。
csrf token仿照飞书，存储在cookie && http header。
