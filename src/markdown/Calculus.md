考试前回忆一遍这些公式，作为热身

[toc]

#### 泰勒级数和麦克劳林级数

$$
Tyalor~seris:
\sum_{n=0}^\infty \frac{f^{(n)}(a)}{n!}(x-a)^n\\
$$
$$
Maclaurin~series:
\sum_{n=0}^\infty \frac{f^{(n)}(0)}{n!}x^n
$$
带拉格朗日余项的泰勒公式：
$$
f(x)=f(a)+f'(a)(x-a)+f''(\xi)\frac{(x-a)^2}{2},(\xi介于x与a之间)
$$

#### 一些比较重要的公式

考试前务必记一下
1. $sin(x+y)=sinxcosy+cosxsiny$
2. $cos(x+y)=cosxcosy-sinxsiny$
3. $sin(2x)=2sinxcosx$
4. $cos(2x)=2cos^2x-1$
5. $a^n-b^n=(a-b)(a^{n-1}+a^{n-2}b+a^{n-3}b^2+...+a^2b^{n-3}+ab^{n-2}+b^{n-1})$
6. $a^3-b^3=(a-b)(a^2+ab+b^2)$
7. $ln~x^n=nln~x$


#### 无穷小

$\lim_{x->0}\frac{f(x)}{g(x)^k}=A$

1. 同阶无穷小：k=1 && A是常数
2. 等价无穷小：k=1 && A==1
3. f(x)是比g(x)低阶的无穷小：k=1 && A是无穷
4. f(x)是比g(x)高阶的无穷小：k=1 && A==0
5. f(x)是关于g(x)的k阶无穷小：k > 0 && A是常数

##### 9个常用等价无穷小

当x -> 0 时：

1. $sinx\approx x$
2. $tanx\approx x$
3. $arcsinx\approx x$
4. $arctanx\approx x$
5. $1-cosx\approx \frac{x^2}{2}$
6. $e^x-1\approx x$
7. $a^x-1\approx x$
8. $(1+x)^a-1\approx ax$
9. $ln(1+x)\approx x$

#### 求极限

2个重要的极限，要会推导
$$
\lim_{x\rightarrow 0}\frac{sin~x}{x}=1\\
\lim_{x\rightarrow \infty}(1+\frac{1}{x})^x=e
$$

应用洛必达法则时要注意的陷阱：

**要保证上下2个函数在a点去心邻域是可导的（左右邻域有一个就行），也就是导函数在a点邻域是连续的。如果是抽象函数，要靠x=a点二阶导数的存在性才能判断a点邻域的一阶导函数连续性。**

#### 间断点

- 第一类间断点（左右极限都存在）
  - 跳跃间断点（左右极限不相等）
  - 可去间断点（左右极限相等）
- 第二类间断点（至少有一边的极限不存在）

#### 一元函数连续、可导、可微

f(x)在x=x_0处连续的定义：

$$
\lim_{x\rightarrow x_0}f(x)=f(x_0)\\
\lim_{\Delta h\rightarrow0}[f(x_0+\Delta h)-f(x_0)]=0\\
\lim_{h\rightarrow0}f(x_0+h)=f(x_0)\\
$$
f(x)在x=x_0处导数的定义：

$$
f'(x_0)=\lim_{\Delta h\rightarrow0}\frac{f(x_0+\Delta h)-f(x_0)}{\Delta h}
$$
$$
f'(x_0)=\lim_{x\rightarrow x_0}\frac{f(x)-f(x_0)}{x-x_0}(x=x_0+\Delta h,\Delta h\rightarrow0,x\rightarrow x_0)
$$

>  连续不一定可导；可导一定连续。

#### 常用的导函数

1. $(sin~x)'=co~sx$
2. $(cos~x)'=-sin~x$
3. $(tan~x)'=sec^2x=\frac{1}{cos^2x}$
4. $(arctan~x)'=\frac{1}{1+x^2}$(会推导)
5. $(arcsin~x)'=\frac{1}{\sqrt {1-x^2}}$(会推导)
6. $(a^x)'=a^xlna$(会推导)
7. $(ln~x)'=\frac{1}{x}$
8. $(\int_{\phi_1(x)}^{\phi_2(x)}f(x))'=f({\phi_2(x)}){\phi_2'(x)}-f({\phi_1(x)}){\phi_1'(x)}$

#### 函数乘除后的导数

$$
(uv)'=u'v+uv'\\
(\frac{u}{v})'=\frac{u'v-uv'}{v^2}
$$
#### 高阶导数

莱布尼兹公式求高阶导数

#### 单调性、极值、凹凸性

##### 单调性

1. f'(x) > 0是f(x)单调增的充分条件

2. f'(x) >= 0是f(x)单调增的必要条件

##### 极值

判断极值的3个充分条件：

1. 左右一阶导数符号相反
2. 一阶导数为0，二阶导数不为零
   1. 二阶导数小于0，极大值
   2. 二阶导数大于0，极小值
3. 前n-1阶导数均为0，n阶导数不为零
   1. n为奇数，不是极值
   2. n为偶数，是极值

求极值的步骤：

1. 找出函数的不可导点和驻点（一阶导数为0）                                                                                                                                                                                                                           
2. 如果疑似极值点的二阶导数存在
   1. 二阶导数小于0，极大值
   2. 二阶导数大于0，极小值
   3. 否则根据疑似极值点左右侧的单调性判断

极值与最值的区别和联系：

> 极值强调的是x=a时的函数值在左右邻域内是极大（小）值，最值可以只考虑单个点无需考虑邻域。

##### 凹凸性和拐点

求凹凸性和拐点：

1. 如果函数在区间上二阶导数>0，凹函数
2. 如果函数在区间上二阶导数<0，凸函数

二阶导数为0是拐点的既非充分也非必要条件：

1. 二阶导数为0的点不一定是拐点，比如$f(x)=x^4$
2. 拐点也可能不存在二阶导数，要考察点的两侧二阶导数正负号

由此可见，如果拐点处三阶导数不为0，则二阶导数为0是拐点的必要不充分条件。

#### 曲率半径和曲率的推导

曲率半径

$$
R=\frac{ds}{da}\\
ds=\sqrt{(x1-x2)^2-(y1-y2)^2}=\sqrt{1+y'^2}dx\\
y'=tana\\
\frac{d}{da}tana=sec^2a=1+tan^2a\\
da=\frac{y''}{1+y'^2}\\
R=\frac{(1+y'^2)^\frac{3}{2}}{|y''|}
$$
曲率

K = 1/R

参数方程的曲率用同样的公式求解

$$
\frac{dy}{dx}=\frac{y_t'}{x_t'}\\
\frac{d^2y}{dx^2}=\frac{d\frac{dy}{dx}}{dx}=\frac{d\frac{dy}{dt}}{dt}\frac{dt}{dx}=\frac{(\frac{dy}{dx})_t'}{x_t'}
$$

#### 常用的积分公式

1. $\int secxdx=ln(secx+tanx)+c$
2. $\int cscxdx=ln(tan \frac{x}{2})+c$
3. $\int tanxdx=ln(secx)+c$

#### 反常积分敛散性比较

##### 直接计算

适用于被积函数的原函数容易求得

##### 比较审敛法

2种形式的反常积分比较方法相似

1. 积分限无穷
   $$
   对于\int_a^\infty f(x)dx,f(x)在[a,\infty]上连续且非负\\
   若\lim_{x\rightarrow \infty}\frac{f(x)}{g(x)}=l\\
   $$
   1. $l=0且\int_a^\infty g(x)dx收敛，则\int_a^\infty f(x)dx收敛$
   2. $l=\infty 且\int_a^\infty g(x)dx发散，则\int_a^\infty f(x)dx发散$
   3. $0<l<\infty，\int_a^\infty g(x)dx和\int_a^\infty f(x)dx敛散性相同$
   
   
2. 被积函数无界
   $$
   对于\int_a^b f(x)dx,a是瑕点（奇点），f(x)在(a,b]上连续且非负\\
   若\lim_{x\rightarrow a+}\frac{f(x)}{g(x)}=l\\
   $$
   1. $l=0且\int_a^b g(x)dx收敛，则\int_a^b f(x)dx收敛$
   2. $l=\infty 且\int_a^b g(x)dx发散，则\int_a^b f(x)dx发散$
   3. $0<l<\infty，\int_a^b g(x)dx和\int_a^b f(x)dx敛散性相同$
   
#### 定积分的应用

##### 求弧长

对于参数方程：

$$
\Delta x=x'(t)\Delta t\\
\Delta y=y'(t)\Delta t\\
\Delta s=\sqrt{(\Delta x)^2+(\Delta y)^2}=\sqrt{x'(t)^2+y'(t)^2}\Delta t\\
L=\int_a^b \sqrt{(x'(t))^2+y'(t)^2}dt
$$


##### 求面积

##### 求体积

对于函数y=f(x)

绕x轴旋转：

$$
\Delta v=\pi f(x)^2\Delta x 
V=\pi\int_{x_1}^{x_2}f(x)^2dx
$$
绕y轴旋转：

选择x作为微元:

$$
\Delta v=[(x+\Delta x)^2-x^2]\pi f(x)=2\pi xf(x)\Delta x\\
V=2\pi\int_{x_1}^{x_2}xf(x)dy
$$
选择y作为微元:

$$
将y=f(x)转换成x=f(y)\\
\Delta v=\pi x^2\Delta y\\
V=\pi\int_{y_1}^{y_2}f(y)^2dy
$$


绕平行x轴或y轴的直线旋转：

关键是在绕x轴或y轴的模型基础上应用微元法找出旋转体的半径

#### 常微分方程

可分离变量的微分方程是基础

$$
\frac{dy}{dx}=f(x)g(y)\\
\Rightarrow\int\frac{dy}{g(y)}=\int f(x)g(x)
$$
齐次方程用变量替换转换成可分离变量的微分方程

一阶线性微分方程的解要会推导

$$
y'+P(x)y=Q(x)\\
重点是找到v(x)使得p(x)v(x)=v'(x)
$$
可降阶的高阶微分方程

1. n阶
2. 2阶只有显x，令$y'=p,y''=p'$
3. 2阶只有显y，令$y'=p(y),y''=p'(y)=p'y'=\frac{dp}{dy}p$

高阶线性微分方程

1. 解的结构

   1. 二阶线性齐次方程
      1. 通解：$C1y1(x)+C2y2(x)$
   2. 二阶线性非齐次方程
      1. 特解加上对应的齐次方程通解。通解：$C1y1(x)+C2y2(x)+y*(x)$

2. 求解方法

   1. 二阶常系数齐次线性方程的通解

   $$
   形如：y''(x)+py'+qy=0\\
   根据特征方程求出特征根r1、r2\\
   r1、r2不相同：y=C1e^{r_1x}+C2e^{r_2x}\\
   r1、r2相同：y=(C1+C2x)e^{r_1x}
   $$
   
   1. 二阶非齐次线性方程的解

$$
形如：y''(x)+py'+qy=f(x)\\
1. 求出对应的齐次线性方程组的通解Y\\
2. 求出特解y*\\
3. 解：通解+特解=>Y+y*\\
$$

特解的求法

$$
1. 如果f(x)=P_m(x)e^{\lambda x},P_m(x)是x的m次多项式\\
y*=x^ke^{\lambda x}Q_m(x)\\
其中：k是\lambda作为特征方程根的次数，取0、1、2\\
Q_m(x)是x的m次多项式，例如A、Ax+B、Ax^2+Bx+C，代入原方程求A、B、C
$$

#### 多元函数微分

极限、连续、可导、可微、一阶偏导数连续的定义和他们之间的关系：

1. 可微 --> 连续

2. 可微 --> 可导

3. 一阶偏导数存在且连续 --> 可微

多元复合函数的求导

$z=f(u, v)$

$\frac{∂z}{∂x}=\frac{∂z}{∂u}\frac{∂u}{∂x}+\frac{∂z}{∂v}\frac{∂v}{∂x}$

隐函数求导，要会推导

$$
\frac{dy}{dx}=-\frac{F_x'}{F_y'}
推导过程：\\
F(x,y)=0=>F(x,g(x))=0\\
对x求导：F_x'+F_y'g(x)'=0\\
g(x)'=-\frac{F_x'}{F_y'}
$$

求多元函数极值的步骤：

1. 求一阶偏导数$\frac{∂z}{∂x}$ 和 $\frac{∂z}{∂y}$
2. 求驻点(x_0, y_0)（一阶偏导数为0）
3. 求二阶偏导$A=f_{xx}(x_0, y_0)$ $B=f_{xy}(x_0, y_0)$ $C=f_{yy}(x_0, y_0)$
4. 通过表达式判断
   1. AC-B^2 > 0 && A > 0 极小值
   2. AC-B^2 > 0 && A < 0 极大值
   3. AC-B^2 < 0 不是极值
   4. AC-B^2 > 0 无法确定

