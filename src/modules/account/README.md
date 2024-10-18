jwt 和 oauth2.0 的联系、区别？

oauth是一套协议，定义了客户端如何认证，但没有定义客户端可以从哪里获取什么样的token用于认证。
jwt是token生成方案，是oauth协议中token格式的具体实现。

#=============

jwe 和 jws 的区别？
jwe：json web encryption；jws：json web signature
jws对token进行签名，中间人劫持请求后可以看到内容，但是无法修改，否则签名校验会失败。
jwe对token进行非堆成加密，中间人劫持请求后看不到内容，也无法修改。

js lib: https://github.com/panva/jose

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

#================

jwt存储在cookie还是http header？

cookie不能跨域，authorization http header可以跨域

1. https://github.com/IdentityServer/IdentityServer3/issues/2039#issuecomment-288135399
2. https://github.com/IdentityServer/IdentityServer3/issues/2039#issuecomment-288135399


#================

csrf和jwt之间的联系：https://security.stackexchange.com/questions/170388/do-i-need-csrf-token-if-im-using-bearer-jwt

#================

刷新jwt的流程：

1. https://stackoverflow.com/questions/27726066/jwt-refresh-token-flow
2. https://www.baeldung.com/cs/json-web-token-refresh-token#:~:text=The%20Role%20of%20Refresh%20Tokens&text=These%20long%2Dlived%20tokens%20are,a%20user%20is%20granted%20access.

#================

使用jwt登录、访问资源：https://medium.com/@maison.moa/using-jwt-json-web-tokens-to-authorize-users-and-protect-api-routes-3e04a1453c3e
