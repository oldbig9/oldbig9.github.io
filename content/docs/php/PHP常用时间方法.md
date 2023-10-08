---
title: "PHP常用时间方法"
date: 2023-03-14 13:47:41
draft: false
tags:
- PHP
categories:
- tech
---


## 获取毫秒时间戳
```php
function getMillisecond() {
  list($s1, $s2) = explode(' ', microtime());
  return (float)sprintf('%.0f', (floatval($s1) + floatval($s2)) * 1000);
}
```