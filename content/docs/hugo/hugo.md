---
title: "Hugo建站"
description: "使用Hugo、Github Actions、Github Pages搭建静态博客网站"
date: 2022-12-26 22:38:14
draft: false
tags:
- Hugo
categories:
- tech
series:
- Hugo
---

## 1.创建Github仓库
开启GitHub Pages功能

## 2.Actions添加workflow
选择Pages分类下的hugo，点击configure按钮可以自动生成配置文件(基本不需要改动)，按提示往下走即可

push代码后即可触发workflow

## hugo主题要求
1. 简洁，依赖少
2. 支持切换亮暗模式或主题颜色
3. 支持展示文章大纲
4. 站内搜索
5. 代码块快捷复制


## 遇到的坑

### 1.文章不展示问题
content目录下增加了几个子目录，但创建文章编译后不展示

#### 原因
hugo默认不会编译未来时间的文章，我修改了文章模板date格式(没有指定时区)，导致hugo编译时认为文章时间是未来时间，就不会编译这篇文章

archetypes/default.md
```yml
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ now.Format "2006-01-02 15:04:05" }}
draft: true
---
```


#### 解决方法一
模板中指定时区或者使用hugo默认格式

```yml
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ now.Format "2006-01-02 15:04:05+0800" }}
draft: true
---
```

```yml
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
---
```

#### 解决方法二
config.toml中增加如下配置

```toml
buildFuture = true
```

这个问题困扰了好久，一直以为是content下目录相关的问题，根本没有往文章时间的问题上去想

感谢! [https://jdhao.github.io/2020/01/11/hugo_post_missing/](https://jdhao.github.io/2020/01/11/hugo_post_missing/)