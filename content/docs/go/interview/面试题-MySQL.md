---
weight: 100
title: "面试题 MySQL"
description: ""
icon: "article"
date: "2025-09-08T16:02:49+08:00"
lastmod: "2025-09-08T16:02:49+08:00"
draft: true
toc: true
tags:
categories:
- tech
series:
---

# MySQL

## 事务隔离级别

- 读未提交（read uncommitted）,在一个事务中可以读到其他事务未提交的数据变化（脏读）
- 读已提交（read committed）在一个事务中可以读到其他事务已经提交的数据变化，这种读取也叫不可重复读，允许出现幻读现象发生，是oaracle数据库的默认事务隔离级别
- 可重复读（repeatable read）MySQL默认隔离级别，在其中一个事务中，直到事务结束前，都可以反复读取到事务刚开始看到的数据，并一直不会发生变化，避免了脏读、不可重复读和幻读现象的发生
- 串行化可读（serializable）在每个读的数据行上都需要家表级共享锁，在每次写数据时都要加表级排他锁。会造成InnoDB的并发能力下降，大量的超时和锁竞争就会发生。

## 死锁问题如何排查

[https://www.cnblogs.com/hanease/p/15955245.html](https://www.cnblogs.com/hanease/p/15955245.html)

## 慢查询怎么统计，用什么指令

mysqldumpslow 命令

返回记录最多的10个慢查询sql
`mysqldumpslow -a -s r -t 10 ~/mysql_slow.log`

## 锁

### 写锁（排他锁）

### MDL锁

开启事务后，会自动获得一个MDL锁

### 意向锁

意向锁是表级锁

意向共享锁

意向排他锁

### 行锁

单个行记录的锁

间隙锁，避免了幻读现象

间隙锁和记录锁组合

## 存储数据结构B+树

叶子节点存储所有数据并形成了有序链表，其他节点只存储索引键值

回表（二次查找），通过二级索引查找到主键（聚簇索引），然后查询夜叶子节点数据，解决方案：覆盖索引，只查询索引覆盖到的字段