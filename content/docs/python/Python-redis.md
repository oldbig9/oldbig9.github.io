---
weight: 999
title: "Python Redis"
description: ""
icon: "article"
date: "2023-12-19T10:29:19+08:00"
lastmod: "2023-12-19T10:29:19+08:00"
draft: false
tags: 
- Python
- Redis
category:
- tech
---


## 连接redis

```python
import redis

# 连接redis
def connect_redis(host, port, password):
    # decode_responses: 是否decode数据，否则返回数据为bytes类型, 例如hgetall返回的是dict[bytes, bytes] 而不是dict[str, str]
    pool = redis.ConnectionPool(host=host, port=port, password=password, decode_responses=True)
    cli = redis.Redis(connection_pool=pool)

    try:
        cli.ping()
    except:
        return None

    return cli


def do_something(cli, key):
    data = cli.get(key)
    if data is None:
        print("key not exists")
    else:
        print(data)

if __name__ == "__main__":
    host = "127.0.0.1"
    port = 6379
    password = "foobared"
    cli = connect_redis(host, port, password)
    if cli is None:
        print("connect redis failed")
    else:
        do_something(cli, "testttttt")
```