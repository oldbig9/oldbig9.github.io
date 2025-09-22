---
weight: 100
title: "Mutex"
description: ""
icon: "article"
date: "2025-09-20T17:07:35+08:00"
lastmod: "2025-09-20T17:07:35+08:00"
draft: true
toc: true
tags:
categories:
- tech
series:
---

```go
type Mutex struct {  
    state int32  
    sema  uint32
}
```