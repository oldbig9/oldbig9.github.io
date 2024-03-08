---
weight: 100
title: "Json Web Token"
description: "身份认证之jwt"
icon: "article"
date: "2024-03-07T06:23:53Z"
lastmod: "2024-03-07T06:23:53Z"
draft: false
tags:
- jwt
categories:
- tech
series:
---

官网：[jwt.io](https://jwt.io/libraries?language=Go)

jwt的优势

- jwt无状态, 服务端不需要存储jwt，没有存储压力
- 跨域支持，前端的移动端、桌面端都可以使用，可以很方便的实现sso

缺点

- 安全性，jwt一旦签发了，直到过期之前就会一直有效，服务端无法主动使jwt无效
- 一次性，jwt一旦签发了就不可修改，只能生成新的token

jwt token由三部分组成，以`.`拼接

```
header(base64 encode).payload(base64 encode).signature
```

header主要用于标识token类型以及使用的算法，主要包含一下字段

```json
{
    "typ": "JWT",   // token类型
    "alg": "HS256"  // 算法类型
}
```

payload(负载信息)

jwt中称之为claims, claims中字段是可以自定义的，jwt官方定义了以下几种字段

[https://datatracker.ietf.org/doc/html/rfc7519#section-4.1](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1)

|key|描述|
|:--|:--|
|iss|(issuer)发送者，即生成jwt token者|
|sub|(subject)主题|
|aud|(audience)接收者|
|exp|(Expiration Time)过期时间|
|nbf|(Not Before)在指定时间之前无效|
|iat|(Issued At)jwt发送时间|
|jti|(JWT ID)jwt唯一标识，需要发送token的业务方去保证token的唯一性，以及校验|

signature(签名信息)

signature是对header、payload两部分的签名，使用header中定义的算法对前两部分内容进行加密，作用是防止jwt被篡改，


go接入jwt

[jwt go package](https://jwt.io/libraries?language=Go)

以golang-jwt为例
```bash
go get -u github.com/golang-jwt/jwt/v5
```



```go
package main

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func main() {
	secretKey := "123"
	audience := "wang"
	token, err := Sign(audience, secretKey, time.Hour)
	if err != nil {
		fmt.Println("Sign failed, ", err)
		return
	}

	valid, err := Valid(token, audience, secretKey)
	if err != nil {
		fmt.Println("Valid failed, ", err)
		return
	}

	if !valid {
		fmt.Println("token is invalid")
	} else {
		fmt.Println("token is valid")
	}
}

// 生成token
func Sign(audience, secretKey string, exp time.Duration) (string, error) {
	j := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp": time.Now().Add(exp).Unix(),
		"aud": audience,
	})

	return j.SignedString([]byte(secretKey))
}

// 验证token
func Valid(token, audience, secretKey string) (bool, error) {
	j, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	}, jwt.WithExpirationRequired(), jwt.WithAudience(audience))

	if err != nil {
		return false, err
	}

	return j.Valid, nil
}
```

