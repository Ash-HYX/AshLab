## 目录
- [矩阵乘法的五种视角](#矩阵乘法的五种视角)
- [逆矩阵及其性质](#逆矩阵及其性质)
- [奇异矩阵与可逆矩阵的判定](#奇异矩阵与可逆矩阵的判定)
- [如何求解逆矩阵（Gauss-Jordan 消元法）](#如何求解逆矩阵gauss-jordan-消元法)
- [AI 总结](#ai-总结)

## 矩阵乘法的五种视角
*Content-[00:48]*

矩阵 $A$ 乘矩阵 $B$ 得到 $C=AB$。已知 $A$ 的形状为 $m \times n$，$B$ 的形状为 $n \times p$，则 $C$ 的形状为 $m \times p$。矩阵乘法的前提条件是：**左边矩阵的列数必须等于右边矩阵的行数**。

### 1\. 标准方法：行乘列（Row times Column）
*Content-[01:18]*
对于结果矩阵 $C$ 中的第 $i$ 行第 $j$ 列的元素 $C_{ij}$，它等于 $A$ 的第 $i$ 行与 $B$ 的第 $j$ 列进行**点积（Dot Product）**。

具体公式如下（以 $C_{34}$ 为例）：
$$
  C_{34} = (\text{row } 3 \text{ of } A) \cdot (\text{column } 4 \text{ of } B)
$$
$$
  C_{34} = a_{31}b_{14} + a_{32}b_{24} + \cdots + a_{3n}b_{n4} = \sum_{k=1}^{n} a_{3k}b_{k4}
$$

这是最经典的矩阵乘法计算规则，也是大多数人理解的矩阵乘法。

### 2\. 列视角（Column Way）
*Content-[06:07]*
将乘法看作矩阵乘向量。矩阵 $A$ 乘上 $B$ 的每一列，得到 $C$ 的每一列。
$$
  A \begin{bmatrix} \text{col 1 of } B \end{bmatrix} = \begin{bmatrix} \text{col 1 of } C \end{bmatrix}
$$
$$
  A \begin{bmatrix} \text{col 2 of } B \end{bmatrix} = \begin{bmatrix} \text{col 2 of } C \end{bmatrix}
$$

**重要结论**：$C$ 的每一列，都是 $A$ 的列向量的**线性组合（Linear Combination）**，组合的系数正是 $B$ 中对应列的元素。

### 3\. 行视角（Row Way）
*Content-[10:07]*
反过来，将 $B$ 作为被乘的对象。矩阵 $A$ 的每一行乘上矩阵 $B$，得到 $C$ 的每一行。
$$
  C = \begin{bmatrix} \text{row 1 of } A \\ \text{row 2 of } A \\ \vdots \end{bmatrix} B
$$

**重要结论**：$C$ 的每一行，都是 $B$ 的行向量的**线性组合**，组合的系数正是 $A$ 中对应行的元素。

### 4\. 列乘行视角（Column times Row）
*Content-[11:38]*
我们平时习惯“行乘列”得到一个数，而这里讨论“列乘行”会得到一个什么样的结果。
假设 $A$ 的第 $k$ 列为 $m \times 1$ 的向量，$B$ 的第 $k$ 行为 $1 \times p$ 的向量。它们相乘会得到一个**完整的 $m \times p$ 矩阵**。

例：二维列向量 $\begin{bmatrix} 2 \\ 3 \\ 4 \end{bmatrix}$ 乘以二维行向量 $\begin{bmatrix} 1 & 6 \end{bmatrix}$，结果如下：
$$
  \begin{bmatrix} 2 \\ 3 \\ 4 \end{bmatrix} \begin{bmatrix} 1 & 6 \end{bmatrix} = \begin{bmatrix} 2 & 12 \\ 3 & 18 \\ 4 & 24 \end{bmatrix}
$$
结果矩阵的列都是 $\begin{bmatrix} 2 \\ 3 \\ 4 \end{bmatrix}$ 的倍数，行都是 $\begin{bmatrix} 1 & 6 \end{bmatrix}$ 的倍数。

**第四种乘法方式结论**：
$$
  AB = \sum_{k=1}^{n} (\text{col } k \text{ of } A) \times (\text{row } k \text{ of } B)
$$
即，$AB$ 等于 $A$ 的各列乘以 $B$ 的对应行之和（得到一组秩为1的矩阵相加）。
*补充概念*：在这个法则下，$A$ 的“列空间（Column Space）”和 $B$ 的“行空间（Row Space）”被极大地凸显。若外积矩阵的行都有着相同的方向，那它们就构成了一条直线；列同理。

### 5\. 分块乘法（Block Multiplication）
*Content-[18:13]*
可以将矩阵切割成若干个子块（Block），然后像普通矩阵乘法一样对子块进行乘法与加法运算。
假设 $A$ 分为四块：$A = \begin{bmatrix} A_1 & A_2 \\ A_3 & A_4 \end{bmatrix}$，$B$ 也分为四块：$B = \begin{bmatrix} B_1 & B_2 \\ B_3 & B_4 \end{bmatrix}$。

则 $C$ 的左上角分块为：
$$
  C_{\text{block 1}} = A_1 B_1 + A_2 B_3
$$
这就是标准的“行块”与“列块”相乘求和。块大小的划分不必须相同，但左右矩阵的对应块维度必须匹配。在计算机计算与并行计算中分块计算至关重要。


## 逆矩阵及其性质
*Content-[21:10]*

不是所有方形矩阵都有逆矩阵。若方阵 $A$ 的逆矩阵 $A^{-1}$ 存在，则必须满足：
$$
  A^{-1}A = I = AA^{-1}
$$
其中 $I$ 为单位矩阵（Identity Matrix）。

**重要性质**：对于**方阵**而言，如果左逆存在，则右逆必然存在且相等（左逆等于右逆），$A^{-1}$ 具有唯一性。*注意：对于非方阵，即使左逆存在，也不一定有右逆，且形状可能不足以支撑逆矩阵。*


## 奇异矩阵与可逆矩阵的判定
*Content-[24:18]*

### 1\. 奇异矩阵（Singular Matrix / No Inverse）
奇异矩阵是没有逆矩阵的方阵。例如：
$$
  A = \begin{bmatrix} 1 & 3 \\ 2 & 6 \end{bmatrix}
$$
**为什么它不可逆？**

- **原因1（列视角）**：观察该矩阵的列，两列成比例（在同一方向）。$A$ 乘任何矩阵得到的列，都只能是 $A$ 列的线性组合。因此无论乘什么，都无法得到单位矩阵的列（如 $\begin{bmatrix} 1 \\ 0 \end{bmatrix}$），因为单位矩阵的列不在这条直线上。
- **原因2（非零向量为零）**：存在一个**非零向量** $x$，使得 $A x = 0$。如上例中，令 $x = \begin{bmatrix} 3 \\ -1 \end{bmatrix}$，则 $A x = 0$。如果 $A^{-1}$ 存在，在 $Ax=0$ 两边同乘 $A^{-1}$ 会推出 $x=0$，这与 $x$ 非零矛盾，所以逆一定不存在。

**结论**：如果一个矩阵的列的某种**线性组合结果为零向量**，即存在非零向量 $x$ 使 $Ax = 0$（该方阵有非平凡零空间），那么该矩阵不可逆（它是奇异矩阵）。

### 2\. 可逆矩阵（Invertible / Nonsingular）
若稍微改变一下，让两列不在同一条直线上：
$$
  A = \begin{bmatrix} 1 & 3 \\ 2 & 7 \end{bmatrix}
$$
这个矩阵就是可逆的，此时 $A x = 0$ 仅当 $x = 0$ 成立。


## 如何求解逆矩阵（Gauss-Jordan 消元法）
*Content-[33:20]*

### 1\. 按列求解方程组的视角
求逆矩阵的本质是解方程组。假设要求 $A^{-1}$ 中的每一列：
设 $A^{-1}$ 的第一列为 $\begin{bmatrix} a \\ b \end{bmatrix}$，第二列为 $\begin{bmatrix} c \\ d \end{bmatrix}$。
则：
$$
  A \begin{bmatrix} a \\ b \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \end{bmatrix} \quad (\text{单位矩阵的第1列})
$$
$$
  A \begin{bmatrix} c \\ d \end{bmatrix} = \begin{bmatrix} 0 \\ 1 \end{bmatrix} \quad (\text{单位矩阵的第2列})
$$
即，求 $A^{-1}$ 等于在相同系数矩阵 $A$ 的情况下，解多个不同右侧向量（也就是单位矩阵的列）的方程组。

### 2\. 高斯-若尔当消元法（Gauss-Jordan Elimination）
**核心思想**：同时解多个方程。将矩阵 $A$ 和单位矩阵 $I$ 并排拼接在一起，形成**增广矩阵（Augmented Matrix）** $[A | I]$。通过一系列行变换（消元），当左边的 $A$ 化为单位矩阵 $I$ 时，右侧的矩阵就自然变成了 $A^{-1}$。

$$
  [A | I] \xrightarrow{\text{消元}} [I | A^{-1}]
$$

**消元步骤示例**（对上述可逆矩阵 $A$ 求解）：
增广矩阵：
$$
  \left[ \begin{array}{cc|cc} 1 & 3 & 1 & 0 \\ 2 & 7 & 0 & 1 \end{array} \right]
$$
1. **向下消元**：第2行减去第1行的2倍。
$$
  \left[ \begin{array}{cc|cc} 1 & 3 & 1 & 0 \\ 0 & 1 & -2 & 1 \end{array} \right]
$$
2. **向上消元（若尔当的追加步骤）**：第1行减去第2行的3倍（将上方主元上方的元素清零）。
$$
  \left[ \begin{array}{cc|cc} 1 & 0 & 7 & -3 \\ 0 & 1 & -2 & 1 \end{array} \right]
$$
此时左侧变为单位矩阵 $I$，右侧的矩阵就是所求逆矩阵 $A^{-1} = \begin{bmatrix} 7 & -3 \\ -2 & 1 \end{bmatrix}$。

### 3\. 为什么 Gauss-Jordan 方法有效？
*Content-[43:14]*
对增广矩阵 $[A | I]$ 执行行变换，等价于用一系列**消元矩阵（Elimination Matrix）** $E$ 去乘整个矩阵。
即：
$$
  E [A | I] = [EA | E]
$$
由于消元过程使左侧变成了单位矩阵 $I$，这意味着：
$$
  EA = I
$$
这直接说明 **$E$ 就是 $A$ 的逆矩阵（$E = A^{-1}$）**！那么右侧原本的 $I$ 被 $E$ 乘之后，自然就变成了 $E \cdot I = E = A^{-1}$。

**总结**：Gauss-Jordan 消元法的本质是利用初等行变换（左乘消元矩阵）把 $A$ 变换为 $I$，而同样的操作作用在单位矩阵 $I$ 上，就把 $I$ 变成了 $A^{-1}$。

## AI 总结
本节课深入探讨了矩阵乘法的五种理解视角（标准行乘列、列组合、行组合、列乘行外积和、分块乘法），帮助从不同维度理解线性变换的本质。随后引入逆矩阵概念，明确指出可逆的充要条件是非奇异（即不存在非零向量 $x$ 使 $Ax=0$ 或列线性无关）。最后详细讲解了求解逆矩阵的强大工具 **Gauss-Jordan 消元法**，揭示了对增广矩阵 $[A|I]$ 进行行变换至 $[I|A^{-1}]$ 的严密数学逻辑，为后续的线性代数分析奠定了坚实基础。

---

## 相关笔记

- [[Lecture01-线性方程的几何]]：Ax=b 与列向量的线性组合
- [[Lecture04-LU分解]]：消元矩阵的逆与 LU 分解
- [[Lecture05-转置排列与空间Rn]]：转置、逆与矩阵运算性质
