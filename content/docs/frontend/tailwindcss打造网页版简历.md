---
weight: 100
title: "tailwindcss打造网页版简历"
description: ""
icon: "article"
date: "2025-07-15T15:13:27+08:00"
lastmod: "2025-07-15T15:13:27+08:00"
draft: false
toc: true
tags:
- tailwind
categories:
- tech
series:
---

突发奇想，使用tailwind+deepseek打造一个web版个人简历，tailwind是一个原子化的css框架，使用也比较广泛，本博客的主题就是基于tailwind实现的，至少写这篇文章时的主题是的🤪

之所以使用deepseek，是因为懒，前端也不熟，也没有好的审美去设计一个好看的简历样式，于是就交给deepseek来吧，AI也的确给我们的生活和工作带来了不小的影响

生成的页面存在两个问题
1. 打印时flex样式换行了，应该是页面尺寸的问题，将类md:(最小尺寸768)换成sm:就好了
2. 打印时背景色没了，增加如下样式设置即可
   ```html
   <style type="text/css">
        @media print {
            body, div, section {
                print-color-adjust: exact !important;  /* 标准属性 */
                -webkit-print-color-adjust: exact !important;  /* Chrome/Safari */
            }
        }
    </style>
   ```
3. 打印时隐藏打印按钮本身
   ```html
    <style type="text/css">
        @media print {
            .print-btn {
                display: none !important;
            }
        }
    </style>
   ```

半成品如下：[个人简历](/html/profile.html)
