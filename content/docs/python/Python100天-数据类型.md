---
title: "Python100天-数据类型"
date: 2023-02-22 14:20:20
draft: false
tags:
  - Python
categories:
  - tech
series:
  - Python100天
---

## 字符串

### 获取字符串长度

```python
s = 'abc中文'
# 三个双引号可以定义多行字符串
s2 = """test
test"""

# 获取字符串长度，Python默认使用utf-8字符集，单个汉字字符长度为1
print(len(s))  # 5
print(len(s2)) # 9
```

### 查找子字符串

```python
s = 'abc中文'

# find()方法返回子字符串位置，不存在则返回-1
print(s.find('中文')) # 3
print(s.find('d'))   # -1

# index()方法找不到子字符串时会报异常，尽量不用
print(s.index('中文')) # 3
print(s.index('d'))   # 报错
```

### 获取子字符串出现次数

```python
s = 'aabc中文'

# count()方法返回子字符串出现次数
print(s.count('a'))    # 2
print(s.count('c中文')) # 1
print(s.count('d'))    # 0
```

### 字符串是否以子字符串开始或结束

```python
s = 'abc中文'

print(s.startswith('a')) # True
print(s.endswith('中文')) # True
print(s.endswith('c'))   # Flase
```

### 切片操作

```python
s = 'abc中文'

print(s[3:])  # 中文
print(s[-2:]) # 中文

# [起始索引:结束索引(不包含):步长]
print(s[:])    # abc中文
print(s[:3])   # abc
print(s[::2])  # ac文
# [::-1]的效果是反转字符串
print(s[::-1]) # 文中cba
```

### 字符串拼接

```python
s1 = 'abc'
s2 = '中文'

# +操作符拼接字符串
print(s1+s2) # abc中文
```

### 字符串去掉头部或尾部子字符串

```python
s = '**abc中文**'

print(s.strip('*'))  # abc中文
print(s.lstrip('*')) # abc中文**
print(s.rstrip('*')) # **abc中文
```

### 字符串大小写转换

```python
s = 'abc'
print(s.upper())         # ABC
print(s.upper().lower()) # abc

# 字符串转单词首字母大写
s = 'hello world'
print(s.title())         # Hello World

# 首字母大写
print(s.capitalize())    # Hello world

"""
对应有判断字符串是否小写或者大写的方法
isupper(), islower(), istitle()
"""
```

### 字符串替换

```python
s = 'abcc中文'

print(s.replace('c', 'd'))    # abdd中文
# 指定替换几个
print(s.replace('c', 'd', 1)) # abdc中文
```

### 判断是不是纯数字字符串

```python
"""
isdigit()
True: Unicode数字，byte数字（单字节），全角数字（双字节），罗马数字
False: 汉字数字

isdecimal()
True: Unicode数字，byte数字（单字节），全角数字（双字节），罗马数字
False: 罗马数字，汉字数字
Error: byte数字（单字节）

isnumeric()
True: Unicode数字，全角数字（双字节），罗马数字，汉字数字
Error: byte数字（单字节）
"""

print('123'.isdigit())  # True
print('123a'.isdigit()) # False
print('123a'.isalnum()) # True
```

### 字符串格式化

```python
"""
%号形式
注意后面变量类型和数量要与前面定义一致，否则报错
"""
print('1: %d, a: %s' % (1, 'a'))

"""
format()方法
format()参数数量要与前面定义数量一致
大于前面定义数量也可以，只用前n个定义的参数
"""
print('{0} + {1} = {2}'.format(1, 2, 3))

"""
f'{var}'形式(Python3.6以后版本)
"""
a, b = 1, 2
print(f'{a} + {b} = {a+b}')
```

### 字符串填充

```python
s = '标题'
print(s.center(20, '-')) # ---------标题---------
print(s.ljust(20, '-'))  # 标题------------------
print(s.rjust(20, '-'))  # ------------------标题
```

## 列表

### 获取列表长度

```python
l = [1,2,'a']
print(len(l)) # 3
```

### 索引操作

```python
l = [1,2,3]
print(l[0])  # 1
print(l[-1]) # 3
```

### 遍历列表

```python
l = ['a', 'b', 'c']

# 通过循环用下标遍历列表元素
for i in range(len(l)):
    print(l[i])

# 通过for循环遍历列表元素
for item in l:
    print(item)

# 通过enumerate函数处理列表之后再遍历可以同时获得元素索引和值
for i, item in enumerate(l):
    print(i, item)
```

### 列表添加删除元素

```python
l = [1,2,3]
# 添加元素
# insert(index, item)
l.insert(0, 0) # [0, 1, 2, 3]
l.append(4)    # [0, 1, 2, 3, 4]

# 合并列表
l.extend([5, 6]) # [0, 1, 2, 3, 4, 5, 6]
l += [7, 8]      # [0, 1, 2, 3, 4, 5, 6, 7, 8]

# 删除元素
# 直接删除元素, 如果有多个重复的元素，remove()只删除第一个
if 1 in l:
    l.remove(1)

# 根据索引删除
item = l.pop(0)
print(item)

# 清空元素
l.clear()
```

### 切片操作

```python
l1 = [1,2,3]
l2 = l1    # 浅拷贝
l3 = l1[:] # 切片操作后的修改不会影响原列表

l2[0] = 4
l2.append(5)
l3[0] = 5
print(l1) # [4, 2, 3, 5]
print(l2) # [4, 2, 3, 5]
print(l3) # [5, 2, 3]

la = ['a', 'b', 'c']
lb = la[:2]   # ['a', 'b']
lb = la[::2]  # ['a', 'c']
lc = la[::-1] # ['c', 'b', 'a'], 反转列表
```

### 列表排序

```python
l = ['a', 'd', 'c', 'ef']

# 列表对象sort()方法，直接修改列表对象
l.sort()
print(l) # ['a', 'c', 'd', 'ef']
l.sort(reverse=True)
print(l) # ['ef', 'd', 'c', 'a']

# sorted()方法
l2 = sorted(l)
print(l2) # ['a', 'c', 'd', 'ef']
l3 = sorted(l2, reverse=True)
print(l3) # ['ef', 'd', 'c', 'a']
l4 = sorted(l2, key=len)
print(l4) # ['a', 'c', 'd', 'ef']
```

### 生成式和生成器

```python
# 生成式，相比生成器占用更多内存空间
f = [x for x in range(1, 5)] # f是列表对象
print(f) # [1, 2, 3, 4]

f = [x + y for x in 'ABC' for y in '123']
print(f) # ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3']

f = (x for x in range(1, 5)) # f是生成器对象
for v in f:
    print(v)
```

## 元组

元组元素不可修改, 元组和字符串一样属于不可变类型

```python
t = ('a', 1, True)
print(t)

# 元组可以使用索引读取元素
print(t[len(t) - 1])

# 元组转列表
l = list(t)
print(l) # ['a', 1, True]

# 列表转元组
t2 = tuple(l)
print(t2) # ('a', 1, True)
```

## 集合

### 创建集合

```python
# 字面量创建集合
s = {1,2,3}

# 构造器语法
s = set(range(1, 4))
s = set((1,2,3))

# 推导式语法
s = {num for num in range(1, 100) if num % 3 == 0 or num % 5 == 0}
```

### 添加删除元素

```python
s = {1,2,3}

# 添加单个元素
s.add(4)
print(s)

# update会将元素拆分后添加进集合
s.update([5, 6])
print(s)

# 删除元素
# discard()删除不存在的元素时不会报错
s.discard(1)
print(s)

# remove()删除不存在的元素时会报错
if 2 in s:
    s.remove(2)
    print(s)

# pop()删除第一个元素
s.pop()
print(s)
```

### 集合交并差运算

```python
s1 = {1,2,3}
s2 = {2,3,4}

# 交集
print(s1.intersection(s2))
print(s1 & s2) # {2, 3}

# 并集
print(s1.union(s2))
print(s1 | s2) # {1, 2, 3, 4}

# 差集
print(s1.difference(s2))
print(s1 - s2)

# 不重复元素集合
print(s1.symmetric_difference(s2))
print(s1 ^ s2)

# 是否子集
print(s1.issubset(s2))
print(s1 <= s2)

# 是否超集
print(s1.issuperset(s2))
print(s1 >= s2)
```

## 字典

### 创建字典

```python
# 字面量语法
d = {'a': 'a', 'b': 'b'}

# 构造器语法
d = dict(a='a', b='b', c='c')
print(d)

# 通过zip函数将两个序列压成字典
d = dict(zip(['a', 'b', 'c'], '123'))
print(d)

# 推导式语法
d = {x: x**2 for x in range(1, 3)}
print(d)
```

### 操作字典

```python
d = {'a': 1, 'b': 2}

# 遍历元素
for key in d:
    print(d[key])

# 添加或更新元素
d.update(b=5)
d['b'] = 3
d['c'] = 4
print(d)

if 'c' in d:
    print(d['c'])

print(d['d']) # 报错

# get()方法不设置默认值，key不存在时返回None
print(d.get('d', 5))

# 删除元素
print(d.popitem()) # ('c', 3)
print(d) # {'a': 1, 'b': 5}

# pop(key[,default]), key不存在时返回default
print(d.pop('a')) # 1
print(d.pop('f', 100)) # 100

# 清空字典
d.clear()
```