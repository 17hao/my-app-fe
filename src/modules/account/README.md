jwt 和 oauth2.0 的联系、区别？

oauth是一套协议，定义了客户端如何认证，但没有定义客户端可以从哪里获取什么样的token用于认证。
jwt是token生成方案，是oauth协议中token格式的具体实现。



怎么做用户名、密码校验？

给用户密码添加固定的盐再hash是不推荐的，攻击者可以用[rainbow table](https://en.wikipedia.org/wiki/Rainbow_table)。
正确做法是给每个用户生成一个随机的盐，但是把用户名作为盐也是不推荐的。
可以用high-entropy salt + unique id作为随机的盐，bcrypt是一种方案。
db里存储随机生成的盐和哈希后的值。

参考：
1. https://stackoverflow.com/questions/536584/non-random-salt-for-password-hashes/536756#536756
2. https://en.wikipedia.org/wiki/Bcrypt
3. https://security.stackexchange.com/questions/379/what-are-rainbow-tables-and-how-are-they-used
