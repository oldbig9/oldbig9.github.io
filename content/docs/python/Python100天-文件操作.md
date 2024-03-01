---
title: "Python100天 文件操作"
date: 2023-02-24 09:45:20
draft: false
tags:
  - Python
categories:
  - tech
series:
  - Python100天
---

## 文件操作模式

| 操作模式 | 具体含义                                           |
| :------: | :------------------------------------------------- |
|    r     | 只读(默认)                                         |
|    w     | 写入，会清空之前的内容，文件不存在则创建新文件     |
|    x     | 写入，如果文件已存在则会产生异常                   |
|    a     | 追加，将内容追加到文件末尾，文件不存在则创建新文件 |
|    b     | 二进制模式                                         |
|    t     | 文本模式(默认)                                     |
|    +     | 更新，既可以读又可以写                             |

## 打开文件

```python
def open_file(filename):
    fp = None
    try:
        fp = open(filename, 'r', encoding='utf-8')
        print(fp.read())

    # except FileNotFoundError:
        # print('无法打开执行文件，', filename)
    except LookupError:
        print('指定了未知的编码，', filename)
    except UnicodeDecodeError:
        print('读取文件时解码失败')
    except Exception as e:
        print(e)
    finally:
        if fp:
            fp.close()

# 推荐使用with open形式打开文件
def with_open_file(filename):
    try:
        # with open 形式不需要关心文件句柄的关闭
        with open(filename, 'r', encoding='utf-8') as fp:
            # 一次读取全部内容
            # print(fp.read())

            # 按行读取
            # for line in fp:
            #     print(line.strip('\n'))

            # 将所有内容按行读取到列表中
            lines = fp.readlines()
            print(lines)
    except FileNotFoundError:
        print('无法打开执行文件，', filename)
    except LookupError:
        print('指定了未知的编码，', filename)
    except UnicodeDecodeError:
        print('读取文件时解码失败')
    except Exception as e:
        print(e)

if __name__ == '__main__':
    # open_file('./tests.txt')
    with_open_file('./test.txt')
```

### 文件写入操作

```python
def write_file(filename):
    try:
        # with open 形式不需要关心文件句柄的关闭
        with open(filename, 'a', encoding='utf-8') as fp:
            fp.write('test'+'\n')
    except IOError:
        print("写入文件失败")
    except Exception as e:
        print(e)


if __name__ == '__main__':
    write_file('./test.txt')
```

### 读写 JSON 文件

JSON 与 Python 类型对应关系

| JSON             | Python     |
| ---------------- | ---------- |
| object           | dict       |
| array            | list       |
| string           | str        |
| number(int/real) | int/float  |
| true/false       | True/False |
| null             | None       |

Python 与 JSON 类型对应关系

| Python                                 | JSON       |
| -------------------------------------- | ---------- |
| dict                                   | object     |
| list，tuple                            | array      |
| str                                    | string     |
| int, float, int- & float-derived Enums | number     |
| True/False                             | true/false |
| None                                   | null       |

json模块主要函数
- dump()，将Python对象按照JSON格式序列化到文件中
- dumps()，将Python对象处理成JSON格式字符串
- load()，将JSON文件中的数据反序列化成Python对象
- loads()，将字符串数据反序列化成Python对象

```python
import json

def write_json_file(data, filename):
    try:
        # with open 形式不需要关心文件句柄的关闭
        with open(filename, 'a', encoding='utf-8') as fp:
            json.dump(data, fp)
    except IOError:
        print("写入文件失败")
    except Exception as e:
        print(e)


if __name__ == '__main__':
    data = {'a':1,'b':2}
    write_json_file(data, './test.json')
```

### 读写CSV文件

```python

```


### 判断文件是否存在

- os.path.exists()，既可以判断文件，也可以判断目录是否存在
- os.path.isfile()
- os.access(path, mode)
    - os.F_OK: 检查文件是否存在
    - os.R_OK: 检查文件是否可读
    - os.W_OK: 检查文件是否可以写入
    - os.X_OK: 检查文件是否可以执行


```python
import os

filename = './test.txt'

if os.path.exists(filename):
    print('文件存在')

if os.path.isfile(filename):
    print('文件存在')

if os.access(filename, os.W_OK):
    print('文件可写')
```

### 创建、删除文件、目录

- os.remove(file) 删除文件
- os.mkdir(dir, mode) 创建目录，mode默认0777
- os.mkdirs(dirs, mode) 递归创建目录