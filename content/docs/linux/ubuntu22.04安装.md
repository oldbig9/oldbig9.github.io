---
title: "ubuntu22.04安装"
date: 2024-01-11 13:43:51
draft: true
tags:
  - linux
  - ubuntu
  - gnome
categories:
  - tech
---

## 为什么安装ubuntu22.04

工作用笔记本一开始安装的是windows，使用了有两年多时间，但是出现了一些问题，乃至后来已经严重影响使用
- 突然有一天屏幕偶发的出现黑色小方块，更新显卡驱动后未解决，好在不影响使用
- 电脑显示wifi已连接，但是浏览器无法访问网页，重启可以暂时解决问题，网上也有同样的案例，试过一些方法例如重置网络，刷新DNS，随机硬件地址等仍未彻底解决问题，此处不再赘述

公司普遍使用的linux版本就是ubuntu，18-22均有；公司需要安装的软件linux版本的包也只有deb；重装ubuntu之前也有一些心理预期，比如gnome高分屏扩展显示器问题等


## 设备配置

|项目|值|
|:--|:--|
|Linux|Ubuntu 22.04.2 LTS|
|Gnome|42.5|
|Window System| X11|
|笔记本屏幕分辨率|3456x2160|
|扩展显示器分辨率|1920x1080|

## 问题

### 高分屏扩展显示器问题

这个是gnome的通病，目前没有很好的解决方案，开启`fractinal scaling`选项效果很差，几乎不可用

### fractinal scaling

可以通过如下命令进行修改，或者直接桌面操作打开相关配置即可

wayland
```
gsettings set org.gnome.mutter experimental-features "['scale-monitor-framebuffer']"
```

X11
```
gsettings set org.gnome.mutter experimental-features "['x11-randr-fractional-scaling']"
```

### 截屏软件flameshot无法编辑截屏信息

这个应该是截屏软件还不支持wayland导致的，登录时改为Xorg就可以了
