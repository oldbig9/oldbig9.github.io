---
weight: 999
title: "Go序列化与反序列化thrift数据"
description: ""
icon: "article"
date: "2024-02-26T08:15:17Z"
lastmod: "2024-02-26T08:15:17Z"
draft: false
tags: 
- Go
- thrift
categories:
- tech
---

## thrift IDL文件定义

foo.thrift

```thrift
namespace go foo

struct Bar {
    1: optional string name; 
}
```

生成go文件

```bash
thrift -gen go foo.thrift
```

## thrift序列化协议

- TBinaryProtocol：二进制编码格式进行数据传输
- TCompactProtocol：高效率的、密集的二进制编码格式进行数据传输
- TJSONProtocol： 使用JSON文本的数据编码协议进行数据传输
- TSimpleJSONProtocol：只提供JSON只写的协议，适用于通过脚本语言解析

## 序列化与反序列化

```go
package main

import (
    "fmt"

    "git.apache.org/thrift.git/lib/go/thrift"

    "foo"
)

func main() {
    bar := foo.Bar{
        Name: "name",    
    }
    
    bf, err := serialize(&bar)
    fmt.Printf("serialize, val: %v, error: %v\n", bf, err)
    if err != nil {
        return
    }

    bar2 := foo.Bar{}
    err = unserialize(bf, &bar2)
    fmt.Printf("unserialize, error: %v\n", err)
    if err != nil {
        return
    }

    fmt.Printf("equal: %v\n", bar.Name == bar2.Name)
}

func serialize(bar *foo.Bar) ([]byte, error) {
	ts := thrift.NewTSerializer()
	trans := thrift.NewTMemoryBuffer()
	tp := thrift.NewTCompactProtocolFactory().GetProtocol(trans)

	ts.Protocol = tp
	ts.Transport = trans

	return ts.Write(bar)
}

func unserialize(msg []byte, bar *foo.Bar) error {
    trans := thrift.NewTMemoryBuffer()
	_, err := trans.Write(msg)
	if err != nil {
		logs.Printf(context.Background(), "[unserialize] Write Msg, error: %v\n", err)
		return
	}
	trans.Flush()
	protocol := thrift.NewTCompactProtocolFactory().GetProtocol(trans)

	err = bar.Read(protocol)

    return err
}
```


