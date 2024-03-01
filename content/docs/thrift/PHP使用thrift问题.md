---
title: "PHP使用thrift问题"
date: 2023-04-03 19:29:42
draft: false
tags:
- Thrift
- PHP
categories:
- tech
---

## TSocket read 0 bytes

原因：数据传输协议导致

thrift数据传输协议分为以下两种

- TBinaryProtocol，是最基本的实现，得到的二进制数据是原始数据
- TCompactProtocol，

```
Internal error processing decrypt: *protectedsecretdata.ProtectedSecretData field 32 read error: don't know what type: %!s(thrift.tCompactType=15)
```


