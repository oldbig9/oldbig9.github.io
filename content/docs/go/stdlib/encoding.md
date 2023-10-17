---
weight: 999
title: "Encoding"
description: "Go标准库-encoding"
icon: "article"
date: "2023-10-17T22:07:47+08:00"
lastmod: "2023-10-17T22:07:47+08:00"
draft: true
toc: true
tag:
  - Go
---

## json

### Functions

#### Compact

`func Compact(dst *bytes.Buffer, src []byte) error`

> 该方法用于去除 json 字符串中多余的空格，常用于压缩 json 字符串，比较两个 json 字符串是否相等等

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
)

func main() {
    s := `{"a": "a", "b": "b"}`
    fmt.Println(s)
    bf := bytes.NewBuffer([]byte{})

    if err := json.Compact(bf, []byte(s)); err != nil {
        fmt.Printf("Compact failed, %v\n", err)
        return
    }

    fmt.Println(string(bf.Bytes()))
}
```

#### HTMLEscape

`func HTMLEscape(dst *bytes.Buffer, src []byte)`

> 该方法将 json 字符串中的字符`<`,`>`,`&`,`U+2028`,`U+2029`转换为`\u003c`,`\u003e`,`\u0026`,`\u2028`,`\u2029`

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
)

func main() {
    bf := bytes.NewBuffer([]byte{})
    s := `{"html":"<p>content</p>"}`
    json.HTMLEscape(bf, []byte(s))

    fmt.Println(string(bf.Bytes())) // {"html":"\u003cp\u003econtent\u003c/p\u003e"}
}
```

#### Indent

`func Indent(dst *bytes.Buffer, src []byte, prefix, indent string) error`

> 用于格式化 json 字符串，增加前缀和缩进

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
)

func main() {
    bf := bytes.NewBuffer([]byte{})
    s := `{"html":"<p>content</p>"}`
    json.Indent(bf, []byte(s), "", "\t")

    fmt.Println(string(bf.Bytes()))
}
```

#### Marshal

`func Marshal(v any) ([]byte, error)`

> json 序列化
>
> html 特殊字符转义
>
> key 升序排序

#### MarshalIndent

`func MarshalIndent(v any, prefix, indent string) ([]byte, error)`

## base64

## csv

## hex

## binary

## xml
