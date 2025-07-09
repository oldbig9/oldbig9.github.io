---
weight: 100
title: "Pillow"
description: ""
icon: "article"
date: "2025-07-09T17:07:07+08:00"
lastmod: "2025-07-09T17:07:07+08:00"
draft: true
toc: true
tags:
categories:
- tech
series:
---

## 给图片增加边框

```python
from PIL import Image, ImageOps

# 打开图片
img = Image.open('input.png')

# 增加边框，border=2表示边框宽度，color='red'表示边框颜色
bordered_img = ImageOps.expand(img, border=2, fill='red')

# 保存加边框后的图片
bordered_img.save('output.png')
```