# 目录
1. [最小生成🌲](#最小生成🌲)
2. [Prim算法](#Prim算法)
3. [Kruskal算法](#Kruskal算法)
    1. [并查集](#并查集)
    2. [实现](#实现)
4. [两种算法的比较](#两种算法的比较)
# 最小生成🌲
&emsp;&emsp;最小生成树(Minimum Spanning Tree)是一张加权无向连通图的子图, 它满足4个性质:

1. 连通图
2. 无环路
2. 覆盖所有的节点
3. 满足上述3个条件的前提下, 所有边的权重之和最小

&emsp;&emsp;介绍2种构建[最小生成树](https://en.wikipedia.org/wiki/Minimum_spanning_tree)的算法：[Prim算法](https://en.wikipedia.org/wiki/Prim%27s_algorithm)和[Kruskal算法](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm)。
## Prim算法

算法步骤:

1. 初始情况下, MST为空
2. 维护一个数组记录每个节点和MST或者父节点的距离

    a. 如果该节点尚未在MST中, 则记录该节点和MST的最小距离

    b. 如果该节点已经在MST中, 则记录该节点和父节点的距离
3. 随机挑选图中的一个节点(一般可以选取下标为0的节点), 从该节点出发构建最小生成树
4. 找到不在MST中且距离MST最小的节点, 记做当前节点
5. 更新当前节点的未在MST中的邻居节点距离MST的值
6. 重复4, 5两个步骤直到所有的图中所有的顶点都被访问过

可以看到Prim算法的步骤和[Dijkstra](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#:~:text=Dijkstra's%20algorithm)算法的步骤十分相似.

[测试用例](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm#Example)选自Wikipedia, 完整代码如下:
```cpp
/*
    output:

    source  destination     distance
    A       B               7
    E       C               5
    A       D               5
    B       E               7
    D       F               6
    E       G               9
*/
#include <iostream>

#define SIZE 7
#define INT_MAX 0x7fffffff

class Prim {
    int findMinDistNode(int dist[SIZE], bool visited[SIZE]) {
        int min = INT_MAX;
        int res = 0;
        for (int i = 0; i < SIZE; i++) {
            if (!visited[i] && dist[i] < min) {
                min = dist[i];
                res = i;
            }
        }
        return res;
    }

    void printRes(int parent[SIZE], int dist[SIZE]) {
        std::cout << "source\tdestination\tdistance\n";
        for (int i = 1; i < SIZE; i++) {
            std::cout << char(parent[i] + 'A') << "\t" << char(i + 'A') << "\t\t" << dist[i] << "\n";
        }
    }

   public:
    void mst(int graph[SIZE][SIZE]) {
        int* dist = new int[SIZE];
        int* parent = new int[SIZE];
        bool* visited = new bool[SIZE];
        for (int i = 0; i < SIZE; i++) {
            dist[i] = INT_MAX;
        }
        dist[0] = 0;
        for (int i = 0; i < SIZE; i++) {
            int curNode = findMinDistNode(dist, visited);
            visited[curNode] = true;
            for (int j = 0; j < SIZE; j++) {
                if (!visited[j] && graph[curNode][j] > 0 && graph[curNode][j] < dist[j]) {
                    dist[j] = graph[curNode][j];
                    parent[j] = curNode;
                }
            }
        }
        printRes(parent, dist);
    }
};

int main(int argc, const char* argv[]) {
    int graph[SIZE][SIZE] = {
        {0, 7, 0, 5, 0, 0, 0},
        {7, 0, 8, 9, 7, 0, 0},  
        {0, 8, 0, 0, 5, 0, 0},
        {5, 9, 0, 0, 15, 6, 0}, 
        {0, 7, 5, 15, 0, 8, 9}, 
        {0, 0, 0, 6, 8, 0, 11},
        {0, 0, 0, 0, 9, 11, 0}
    };
    Prim prim;
    prim.mst(graph);
}
```
## Kruskal算法
算法步骤:

1. 初始情况下MST为空
2. 将图中所有的边按权值从小到大排序
3. 每次选取权值最小的边, 如果该条边的加入不会使MST形成环路, 则将这条边加入
4. 重复步骤3, 直到图中所有的边都被访问过

第三步中判断图是否会形成环路可以用[并查集](https://en.wikipedia.org/wiki/Disjoint-set_data_structure)实现.

### 并查集
并查集是一种可以用来判断2个集合是否有交集的数据结构.

并查集中每个集合的元素用一个父元素标识它们处于同一个集合中

例如:
```text
+-----+---+---+---+---+---+---+---+---+---+
|index| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
+-----+---+---+---+---+---+---+---+---+---+
|value| 0 | 1 | 2 | 1 | 2 | 0 | 2 | 0 | 1 |
+-----+---+---+---+---+---+---+---+---+---+

在这个用数组表示的并查集中, 有3个集合: {0, 5, 7} {1, 3, 8} {2, 4, 6}
```

完整代码如下:
```cpp
#include <iostream>
#include <vector>

class UnionFind {
    std::vector<int> uf;
   
   public:
    UnionFind(int size) {
        for (int i = 0; i < size; i++) {
            uf.push_back(i);
        }
    }

    int find(int x);

    bool connected(int x, int y);

    void unoinSets(int xset, int yset);
};

int UnionFind::find(int x) {
    if (uf[x] != x) {
        return find(uf[x]);
    } else {
        return uf[x];
    }
}

bool UnionFind::connected(int x, int y) {
    return find(x) == find(y);
}

void UnionFind::unoinSets(int x, int y) {
    int xset = find(x), yset = find(y);
    if (xset == yset) {
        return;
    } else {
        uf[yset] = xset;
    }
}
```
### 实现
[测试用例](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm#Example)选自Wikipedia, 完整代码如下:
```cpp
/*
    output:

    source  destination     distance
    A       B               7
    E       C               5
    A       D               5
    B       E               7
    D       F               6
    E       G               9
*/
#include <algorithm>
#include <array>
#include <iostream>
#include <vector>

#include "UnionFind.cpp"

#define SIZE 7

class Edge {
   public:
    int src;
    int dst;
    int length;

    Edge(int x, int y, int z): src(x), dst(y), length(z){}
};

class Kruskal {
    UnionFind* uf;
    std::vector<Edge> edges;

    void initializeMembers(std::array<std::array<int, SIZE>, SIZE> graph) {
        uf = new UnionFind(SIZE);
        for (int i = 0; i < SIZE; i++) {
            for (int j = i; j < SIZE; j++) {
                if (graph[i][j] > 0) {
                    edges.push_back(Edge(i, j, graph[i][j]));
                }
            }
        }
    }
    
    void printRes(std::vector<Edge> res) {
        std::cout << "sorce\tdestination\tdistance\n";
        for (Edge e : res) {
            std::cout << char(e.src + 'A') << "\t" << char(e.dst + 'A') << "\t\t" << e.length << "\n";
        }
    }

   public:
    void mst(std::array<std::array<int, SIZE>, SIZE> graph) {
        initializeMembers(graph);
        std::sort(edges.begin(), edges.end(), [](Edge e1, Edge e2) {return e1.length < e2.length;});
        std::vector<Edge> res;
        for (Edge e : edges) {
            if (!uf->connected(e.src, e.dst)) {
                res.push_back(e);
                uf->unoinSets(e.src, e.dst);
            }
        }
        printRes(res);
    }
};

int main(int argc, const char* argv[]) {
    Kruskal kruskal;
    std::array<std::array<int, SIZE>, SIZE> graph {{
        {{0, 7, 0, 5, 0, 0, 0}},
        {{7, 0, 8, 9, 7, 0, 0}},
        {{0, 8, 0, 0, 5, 0, 0}},
        {{5, 9, 0, 0, 15, 6, 0}}, 
        {{0, 7, 5, 15, 0, 8, 9}}, 
        {{0, 0, 0, 6, 8, 0, 11}},
        {{0, 0, 0, 0, 9, 11, 0}}
    }};
    kruskal.mst(graph);
}
```

## 两种算法的比较

1. Prim算法关注顶点之间的距离, 适合稠密图; Kruskal算法则关注选取权值最小的边, 适合稀疏图
2. Prim算法中每一步挑选完MST下一个顶点后, 子MST是联通的; kruskal算法无法保证每一步构建的子MST是联通的