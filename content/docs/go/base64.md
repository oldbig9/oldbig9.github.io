---
weight: 100
title: "golang base64编解码问题"
description: ""
icon: "article"
date: "2025-06-10T14:08:26+08:00"
lastmod: "2025-06-10T14:08:26+08:00"
draft: false
toc: true
tags:
  - Go
categories:
  - tech
series:
---

由于业务需要，go 服务需要调用 java 服务接口，其中需要对参数进行 base64 编解码

`encoded := base64.URLEncoding.EncodeToString(data)`

java 侧错误日志如下，提示 base64 字符串末尾有无效字符

```plaintext
org.bouncycastle.util.encoders.DecoderException: exception decoding URL safe base64 string: invalid characters encountered at end of base64 data
```

切换为 base64.RawURLEncoding 编码后，报错如下，提示字符串长度错误

```plaintext
org.bouncycastle.util.encoders.DecoderException: exception decoding URL safe base64 string: 107
```



**BouncyCastle base64 编码与 go 的对比**

| 特性         | Java BouncyCastle UrlBase64 | Go                                     |
| :----------- | :-------------------------- | :------------------------------------- |
| 替换 + 为 -  | 自动处理                    | base64.URLEncoding 自动处理            |
| 替换 / 为 \_ | 自动处理                    | base64.URLEncoding 自动处理            |
| 填充符号     | "."作为填充符号             | base64.URLEncoding 默认"="作为填充符号 |
| 换行处理     | 无换行                      | 默认无换行                             |
| 解码灵活性   | 严格                        | RawURLEncoding 处理无填充情况          |

**go URLEncoding 与 RawURLEncoding 区别**

| 特性     | URLEncoding                  | RawURLEncoding                 |
| :------- | :--------------------------- | :----------------------------- |
| 填充字符 | 使用 = 填充                  | 不使用填充                     |
| 输出长度 | 总是 4 的倍数(因为有填充)    | 可能不是 4 的倍数(无填充)      |
| 兼容性   | 与标准 Base64 解码器兼容更好 | 更紧凑，但可能不兼容某些解码器 |

> base64.URLEncoding.WithPadding(base64.NoPadding) 与 base64.RawURLEncoding 效果一样

原来 java bouncycastle 库中 base64 编码是带填充的，会以`.`符号进行填充，所以 go 服务应该带填充的方式进行编解码

```go
package main

import (
    "encoding/base64"
    "fmt"
)

func main() {
    // 编码
    data := []byte("Hello, World!")
    encoded := base64.URLEncoding.WithPadding('.').EncodeToString(data)
    fmt.Println("Encoded:", encoded)
    // 解码
    decoded, err := base64.URLEncoding.WithPadding('.').DecodeString(encoded)
    if err != nil {
        fmt.Println("Error decoding:", err)
        return
    }
    fmt.Println("Decoded:", string(decoded))
}
```