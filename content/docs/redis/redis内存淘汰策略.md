---
weight: 999
title: "Redis内存淘汰策略"
description: ""
icon: "article"
date: "2023-12-19T20:57:54+08:00"
lastmod: "2023-12-19T20:57:54+08:00"
draft: false
toc: true
tag:

- Redis
  category:
- tech
  ---

## redis 内存淘汰策略

| 策略              | 描述                               |
|:--------------- |:-------------------------------- |
| noeviction      | 新写入操作会报错                         |
| allkeys-lru     | 在所有键值对数据中，根据 lru 算法移除最近最少使用的 key |
| allkeys-random  | 在所有键值对数据中, 随机移除某个 key            |
| volatile-lru    | 在设置了过期时间的键值对中，移除最近最少使用的 key      |
| volatile-random | 在设置了过期时间的键值对中，随机移除某个 key         |
| volatile-ttl    | 在设置了过期时间的键值对中，移除最近的即将过期的 key     |
