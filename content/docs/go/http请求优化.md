---
weight: 100
title: "http请求优化"
description: ""
icon: "article"
date: "2024-06-05T13:10:07Z"
lastmod: "2024-06-05T13:10:07Z"
draft: true
toc: true
tags:
categories:
- tech
series:
---

go http client默认是复用client的，但是默认的http transport

```go
t := http.DefaultTransport.(*http.Transport).Clone()
t.MaxIdleConns = 100
t.MaxConnsPerHost = 100
t.MaxIdleConnsPerHost = 100
	
httpClient = &http.Client{
  Timeout:   10 * time.Second,
  Transport: t,
}
```

https://www.loginradius.com/blog/engineering/tune-the-go-http-client-for-high-performance/