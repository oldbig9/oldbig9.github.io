---
weight: 100
title: "Go Map"
description: ""
icon: "article"
date: "2025-09-20T15:14:13+08:00"
lastmod: "2025-09-20T15:14:13+08:00"
draft: true
toc: true
tags:
categories:
- tech
series:
---

## 底层数据结构

- go1.23及之前: 哈希桶+拉链法
    ```go
    // A header for a Go map.
    type hmap struct {
        count     int // map中元素个数
        flags     uint8 // 状态标志位，标记map的一些状态
        B         uint8  // 桶数以2为底的对数，即B=log_2(len(buckets))，比如B=3，那么桶数为2^3=8
        noverflow uint16 //溢出桶数量近似值
        hash0     uint32 // 哈希种子

        buckets    unsafe.Pointer // 指向buckets数组的指针
        oldbuckets unsafe.Pointer // 是一个指向buckets数组的指针，在扩容时，oldbuckets 指向老的buckets数组(大小为新buckets数组的一半)，非扩容时，oldbuckets 为空
        nevacuate  uintptr        // 表示扩容进度的一个计数器，小于该值的桶已经完成迁移

        extra *mapextra // 指向mapextra 结构的指针，mapextra 存储map中的溢出桶
    }
    ```


- go1.24及之后: swiss table（开放寻址哈希表）

    grou->slot->element
    ```go
    type SwissMapType struct {
        Type
        Key   *Type
        Elem  *Type
        Group *Type // internal type representing a slot group
        // function for hashing keys (ptr to key, seed) -> hash
        Hasher    func(unsafe.Pointer, uintptr) uintptr
        GroupSize uintptr // == Group.Size_
        SlotSize  uintptr // size of key/elem slot
        ElemOff   uintptr // offset of elem in key/elem slot
        Flags     uint32
    }
    ```

    [更快的 Go Map：Swiss Tables](https://golang.ac.cn/blog/swisstable)

    英文原文[Faster Go maps with Swiss Tables](https://go.dev/blog/swisstable)

## map遍历为什么设置成无序的

map扩容后会rehash，key无法保证原来的顺序，这也是为什么无法对map的key或value进行取址操作

## map删除元素

map删除元素并不会立刻释放或收缩map占用的内存，只会把key和value对应的内存块标记为空闲，让他们的内容可以被GC回收。删除元素，map的规模不会缩小