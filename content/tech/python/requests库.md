---
title: "Requests库"
date: 2023-06-01 16:39:10
draft: false
tags:
- Python
categories:
- tech
---

## 简单Get请求

```python
#!/usr/bin/python3

import requests


# get返回html文本
def getData(url):
    result = requests.get(url)
    print(result.json())


if __name__ == '__main__':
    url = "https://mock.apifox.cn/m2/2245336-0-default/64492343"
    getData(url)
```

## Post请求

### form表单请求
```python
#!/usr/bin/python3

import requests


# post form表单请求
def postData(url):
    data = {"key1": "value1", "key2": "value2"}
    result = requests.post(url, data=data)
    print(result.json())


if __name__ == '__main__':
    url = "https://baidu.com"
    postData(url)
```

### json请求

```python
#!/usr/bin/python3

import requests


# post form表单请求
def postJsonData(url):
    data = {"key1": "value1", "key2": "value2"}
    result = requests.post(url, json=data)
    print(result.json())


if __name__ == '__main__':
    url = "https://baidu.com"
    postJsonData(url)
```