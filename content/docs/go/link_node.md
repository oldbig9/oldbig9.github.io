---
title: "链表"
date: 2023-07-04 19:30:34
draft: false
tags:
- Go
- algorithm
categories:
- tech
---


## 链表简述

> 链表（Linked list）是一种常见的基础数据结构，是一种线性表，但是并不会按线性的顺序存储数据，而是在每一个节点里存到下一个节点的指针(Pointer)。由于不必须按顺序存储，链表在插入的时候可以达到O(1)的复杂度，比另一种线性表顺序表快得多，但是查找一个节点或者访问特定编号的节点则需要O(n)的时间，而顺序表相应的时间复杂度分别是O(logn)和O(1)

链表分为单链表、双链表、循环链表、块状链表等


## 初始化链表

```go
package main

import (
    "fmt"
)

func main() {
    // 初始化链表
    head := new(LinkNode)
    initLink(head)
    
    // 遍历链表
    iterateLinkedList(head)
}

type LinkNode struct {
    Val int
    Next *LinkNode
}

// 初始化链表
func initLink(head *LinkNode) {
    a := []int{1,2,3,4,5}
    tail := new(LinkNode)
    for k, v := range a {
        if k == 0 {
            head.Val = v
            tail = head
        }else {
            node := new(LinkNode)
            node.Val = v
            tail.Next = node
            tail = node
        }
    }
    tail.Next = head // 循环链表, 去掉此行即为单链表
}


// 遍历链表
func iterateLinkedList(head *LinkNode) {
    node := head
    for node.Next != nil {
        fmt.Println(node.Val)
        if node.Next == head {
            break
        }
        node = node.Next
    }
}

func (node *LinkNode) Next() *LinkNode {
    return node.Next
}
```


