---
weight: 100
title: "面试题 Redis"
description: ""
icon: "article"
date: "2025-09-08T16:20:54+08:00"
lastmod: "2025-09-08T16:20:54+08:00"
draft: true
toc: true
tags:
categories:
- tech
series:
---

# Redis

## 为什么用redis

内存数据库比较快，可持久化存储，服务器重启可快速恢复数据

## 数据持久化

### RDB

RDB可以看作是redis在某一个时间点上的快照（snapshot），适合用于备份数据和故障恢复

```bash
# 900秒内有一个key发生了改变就持久化一次，关闭持久化就将save配置为空字符串即可
$ redis-cli config set save "900 1"
```

### AOF（append-only-file）

AOF是一个写入操作日志，将在服务器重启时被重放，数据一致性比RDB高

```bash
# 设置AOF
$ redis-cli config set appendonly yes
```

可以通过appendsync参数来调整AOF频率
- always：每个命令都调用fsync()，服务器崩溃或故障时，只丢失一个命令，但这种方式redis性能会受到应次昂
- everysec：每秒调用一次fsync()，建议设置为该频率
- no: 永远不掉用fsync()，由操作系统决定何时将数据从缓冲区写入到磁盘，大多数linux系统中，这个频率是30秒

### RDB和AOF结合使用

同时启用两种持久化方式之后，可以将配置参数aof-use-rdb-preamble设置为yes，来启用redis4.x之后提供的混合持久化功能

## 缓存击穿、穿透、雪崩

- 击穿。热key过期，解决方案：1. 永不过期，2. 互斥锁（setnx，拿到锁的才去查询数据库），3. 逻辑过期
- 穿透。大量缓存key不存在，导致数据库压力大，解决方案：1. 缓存空数据，2.布隆过滤器 
- 雪崩。大量key同时过期，解决方案，1. 随机过期时间，2. 提前预热，3. 服务降级和熔断,4. 构建高可用集群，防止服务器宕机导致的全局雪崩

## 哨兵集群

## redis和mysql数据一致性方案

双删方案：删除缓存->更新数据库->删除缓存

方案一：cache-aside pattern（旁路缓存模式）

    读流程 (Read)

        读缓存，命中则直接返回。

        缓存未命中，则读数据库。

        将数据库中的数据写入缓存，然后返回。

    写流程 (Write) - 核心分歧点

        更新数据库

        删除缓存 (注意：不是更新缓存)

方案二：延迟双删

方案三：读写穿透
此模式将缓存作为主要数据源

方案四：异步监听binlog
核心思想是将缓存与业务解耦

