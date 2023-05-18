---
title: "Urldecode方法问题"
date: 2023-05-18 18:47:44
draft: false
tags:
- PHP
categories:
- tech
---

## urldecode将+号替换为空格问题

下面字符串经过urldecode()之后，其中一个+号被替换成了空格

```php
<?php

$str = 'S+测+试';
$str = urldecode($str);

var_dump($str); // string(9) "S 测 试"
```

解决方案：

PHP4以上版本提供了rawurldecode()方法

