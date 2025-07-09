---
weight: 100
title: "Pandas实用场景"
description: ""
icon: "article"
date: "2025-06-24T16:45:46+08:00"
lastmod: "2025-06-24T16:45:46+08:00"
draft: true
toc: true
tags:
categories:
- tech
series:
---

比较csv文件中某一列与另一列差异的数据

```python
import pandas as pd

# 读取CSV文件
df = pd.read_csv('demo.csv')

# 获取第一列和第二列的唯一值集合
col1 = set(df.iloc[:, 0])
col2 = set(df.iloc[:, 1])

# 找出第一列有但第二列没有的数据
diff = col1 - col2
diff_list = list(diff)
print(diff_list)
```

> excel中直接选中要比较的两列，然后`Ctrl+\`即可选出不一样的数据，然后可以给相关数据设置背景色等操作
> 
> wps中可以直接使用wps AI进行操作，AI确实带来了很多的影响，上面的python代码也是通过AI生成的
