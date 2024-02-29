---
weight: 999
title: "Redis内存优化"
description: ""
icon: "article"
date: "2024-01-31T16:52:54+08:00"
lastmod: "2024-01-31T16:52:54+08:00"
draft: false
tags:
  - Redis
category:
  - tech
---



最近工作上遇到了一些redis相关的问题，记录一下

问题：

线上redis集群存储了3亿多条数据，几乎都是hash类型，字段在2-8个不等，值都比较小，集群容量占用了大概80多G，由于key数量增长较快，短时间内缓存也无法释放，所以考虑存储上是否有可以优化的空间

翻译自 https://docs.redis.com/latest/ri/memory-optimizations/

英语渣渣，权当笔记了



# 最佳开发实践

### 避免动态生成lua脚本

避免动态生成lua脚本，防止由此导致的lua脚本缓存增加且超出控制范围。每当lua脚本加载时就会占用一定的内存，内存占用如下

- server.lua_scripts存储脚本原始内容字典

- lua存储编译后的二进制文件

所以如果需要使用lua脚本，最好是通过eval命令，因为该命令不需要提前加载



#### 使用lua脚本需要注意的事情

- 注意lua脚本内存占用，定期刷新缓存

- 不要硬编码或动态生成key



### 使用32位redis服务器

64位redis服务器存储分析数据如下

- 空的redis实例占用约3MB内存

- 1百万小的string类型的key-value占用约85MB内存

- 1百万hash类型的key(5个field)占用约160MB内存

如果存储数据大小不超过3G(这里应该是指单个key)，可以考虑使用32位服务器;

如果key名称长度超过32位，在32位服务器上会导致内存占用增加



### 加速过期缓存的内存回收

redis中如果给一个key设置了过期时间，但是redis并不会在key过期时立即删除该key；redis使用了一种随机算法(lru或ttl)来查询哪些key应该被过期掉。因为算法是随机的，所以有一定机率会导致有些key即使过期了也不会被删掉。这也意味着redis中已经过期的key还占用着内存，直到这些key被再次访问时才会被删除。



#### 如何判断redis中存在过期key没有被回收的情况

1. 使用`info`命令查看集群的`total_memory_used`，并且计算key的数量总和

2. 检查redis集群RDB备份文件，查看内存占用及key的数量是否与第一步得出的结果相差太多



#### 如何加速redis内存回收

1. 重启redis服务(该方法生产环境应该不可行，对业务有损)

2. 增加配置文件redis.conf中`maxmemory-samples`配置，默认是5。

3. 增加一个定时任务，定期执行scan命令，这样也会加速内存回收



`maxmemory-samples`配置表示使用算法从需要淘汰的列表中随机选择sample个key，选出闲置时间最长的key进行淘汰。增加该配置值虽然可以加速内存回收，但是也会消耗更多的CPU资源，意味着会导致命令延迟



### 更好的序列化数据

redis不会指定序列化对象的存储类型，它们在redis中都是以byte array形式存储。常规的序列化可能会导致更大的内存占用。可以选择更好的序列化协议，如Protocol Buffers、MessagePack等等



## 数据类型相关的建议

### 使用hash来存储整合较小的string类型的key

字符串类型在64位机器上大概占用90字节，例如`set foo bar`这个命令就会占用大约96字节，其中约90字节是string类型的开销，所以字符串类型适用于以下场景

- 字符串至少在100字节以上

- 存储的是一个序列化后的对象

- 使用字符串来表示一个数组或者位图



hash类型为什么节省内存，因为hash中的field只存储了value，没有其他多余的数据，例如：idle时间，过期时间，依赖对象数量，编码等



#### 什么场景不建议使用hash替代string

当key的数量小于1百万，且内存占用不高时，不建议使用hash替代string



#### 使用ziplist而不是hash table

hash类型有两种编码方式：hash table和ziplist。redis的两个配置`hash-max-ziplist-entries` 、`hash-max-ziplist-value`决定了存储hash时使用哪种数据结构；默认配置如下：

- hash-max-ziplist-entries = 512

- hash-max-ziplist-value = 64

当存储的hash数据小于上面配置，即**键值对个数小于等于512，键值对中值的长度小于等于64字节**时使用ziplist结构存储，超过任一配置，则使用hash table存储



#### ziplist为什么占用更少的内存

因为ziplist的每个键值对只存储了3个数据：

1. 前一个键值对的长度

2. 该键值对的长度

3. 存储的值



**注：ziplist可能导致命令延迟和cpu使用率增加的情况**



> 有序集合也可以使用ziplist结构存储，区别是 `zset-max-ziplist-entries`默认是128个元素



### set改为intset

待译



#### 减小key的长度

假如1亿条数据的场景，下面两个不同长度的key

- my-descriptive-large-keyname (28个字符)

- my-des-lg-kn (12个字符)

短的key节省了16个字符，一亿条数据就节省了约1.6G的内存



### 使用list而不是hash

hash比list多存储了field，所以list占用内存少



#### 什么场景下不建议使用list替代hash

1. hash少于50000个键值对

2. 存储的hash键值对数量不一致



## 数据压缩方法

1. 压缩键的长度

2. 压缩值



# 实践

回到原来的问题，线上数据存储类型为hash，键值对数量不超过7个，值的长度没有超过64字节(最长的是13位的毫秒时间戳)，所以底层存储结构应该位ziplist，所以这里没有优化的空间了；

减小key长度方面

- hash key，前缀(19字符)+计划ID(6-8字符)+用户标识id(42字符) ~= 58字符，可以减小前缀长度至10字符以内，大约每个key可以节省10字符

- field都是比较语义化的单词，可以通过简称，每个field减少约10个字符，每个hash至多8个field，至少2个field，平均减少约30个字符

- 其中4个field的值为字符串"true"，可以改为int 1



减小缓存时间，使缓存可以及时释放，但需要业务上能够接受


