---
title: "ubuntu22.04安装"
date: 2024-01-11 13:43:51
draft: false
tags:
  - linux
  - ubuntu
  - gnome
categories:
  - tech
---

## 为什么安装 ubuntu22.04

工作用笔记本一开始安装的是 windows，使用了有两年多时间，但是出现了一些问题，乃至后来已经严重影响使用

- 突然有一天屏幕偶发的出现黑色小方块，更新显卡驱动后未解决，好在不影响使用
- 电脑显示 wifi 已连接，但是浏览器无法访问网页，重启可以暂时解决问题，网上也有同样的案例，试过一些方法例如重置网络，刷新 DNS，随机硬件地址等仍未彻底解决问题，此处不再赘述

公司普遍使用的 linux 版本就是 ubuntu，18-22 均有；公司需要安装的软件 linux 版本的包也只有 deb；重装 ubuntu 之前也有一些心理预期，比如 gnome 高分屏扩展显示器问题等

## 设备配置

| 项目            | 值                  |
|:------------- |:------------------ |
| Linux         | Ubuntu 22.04.2 LTS |
| Gnome         | 42.5               |
| Window System | X11                |
| 笔记本屏幕分辨率      | 3456x2160          |
| 扩展显示器分辨率      | 1920x1080          |

## 问题

### 高分屏扩展显示器问题

这个是 gnome 的通病，目前没有很好的解决方案，开启`fractinal scaling`选项效果很差，几乎不可用

xorg不支持针对单个显示器独立设置缩放比例；wayland可以针对单个显示器设置缩放比例，但是效果不太好

### 分数倍数缩放(fractinal scaling)

可以通过如下命令进行修改，或者直接桌面操作打开相关配置即可

wayland

```
gsettings set org.gnome.mutter experimental-features "['scale-monitor-framebuffer']"
```

X11

```
gsettings set org.gnome.mutter experimental-features "['x11-randr-fractional-scaling']"
```

### 截屏软件 flameshot 无法编辑截屏信息

这个应该是截屏软件还不支持 wayland 导致的，登录时改为 Xorg 就可以了

### ubuntu 关机后无法登录

开机可以进入登录页面，输入密码后一直卡在住，无法进入桌面

解决方法：

recovery 模式修改 grub 启动配置，按下开机键后，待屏幕显示笔记本厂商 logo 后同时按下 Shift+ESC 键(网上有说只按住 Shift 键即可)不动，直到进入引导项；选择进入 recovery 模式，编辑启动配置，再 splash quiet 后面追加 nomodeset 参数，然后启动即可正常进入桌面；此时只是临时解决，需要修改 grub 文件才可以彻底解决，`vim /etc/default//grub` 修改 GRUB_CMDLINE_LINUX_DEFAULT 的值，追加 nomodeset 参数，然后`sudo update-grub`,重启系统

```bash
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash nomodeset"
```

该方法可以正常登录，但是带来了其他问题

1. 无法调节亮度(亮度调节不展示了)

2. 登录页面无法选择窗口管理协议(nomodeset 导致)

根本原因还是显卡驱动问题；ubuntu22.04 默认窗口管理协议是 wayland，后来因为 flameshot 在 wayland 下无法正常工作，chrome 经常卡顿，所以登录时改成了 Xorg，显卡驱动在`Software Updates`> `Additional Drivers` 显示是`nouveau`；这里并没有主动改过显卡驱动；

将 grub 文件恢复原来配置，更新系统后，可以正常登录，亮度可以调节

安装完系统可以立即更新一下系统和 grub 引导，防止出现此类问题

如果可以看到登录页面，其实可以不进入 recovery 模式，直接进入 tty 模式去修改 grub 引导

快捷键：`Ctrl+Alt+F2`，我的是小米笔记本，其他笔记本可能是别的 F 键，可以都试一下

### 修改指针主题

Gnome 主题网站[Cursors - Gnome-look.org](https://www.gnome-look.org/browse?cat=107&ord=latest)

目前我使用的是 [Bibata-Modern-Amber](https://github.com/ful1e5/Bibata_Cursor)，该主题甚至支持个性化定制各种颜色的主题，详见github

将压缩包下载之后解压并拷贝至用户目录下

```bash
tar -xf  Bibata-Modern-Amber.tar.xz
mv  Bibata-Modern-Amber ~/.icons/
```

然后就可以在 Tweaks 应用>appearance>Cursor 中选择添加的主题

ubuntu22.04 自带的 firefox 是 snap 包，修改鼠标指针主题时发现在 firefox 上不生效，按装成 deb 包就可以了

```bash
sudo snap remove firefox
```

[如何在 ubuntu22.04 上安装火狐 .deb 软件包（而非 snap 软件包）[翻译自 omgubuntu] - Ubuntu 中文论坛](https://forum.ubuntu.com.cn/viewtopic.php?f=1&t=493123)

### 安装docker

[Install Docker Engine on Ubuntu | Docker Docs](https://docs.docker.com/engine/install/ubuntu/)

[Install the Compose plugin | Docker Docs](https://docs.docker.com/compose/install/linux/)

linux环境下，docker默认是root用户才可以运行，非root用户想要运行docker命令，需做以下修改

```bash
# 新建docker用户组
sudo groupadd docker
# 将当前用户加入docker用户组
sudo gpasswd -a $USER docker
# 更新docker用户组
newgrp docker
```

### 安装软件依赖冲突问题

解决方案

#### aptitude工具

```bash
sudo apt install aptitude
```

使用aptitude替代apt安装软件，并根据提示使用aptitude建议的安装方案

```bash
sudo aptitude install gimp
```

#### flapak

该方案不算是解决依赖冲突，而是使用了另一种方式安装软件; 这种安装包一般都是直接提供了软件所有的依赖，所以软件包体积非常大

1.安装flatpak[Ubuntu Flathub Setup | Flathub](https://flathub.org/setup/Ubuntu)

```bash
sudo apt install flatpak
```

2.添加镜像源

应用商店 [https://flathub.org/](https://flathub.org/)

```bash
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
```

3.安装软件

例如[Foliate | Flathub](https://flathub.org/apps/com.github.johnfactotum.Foliate)

```bash
flatpak install flathub com.github.johnfactotum.Foliate
```

```bash
flatpak run com.github.johnfactotum.Foliate
```

4.flatpak应用图标

flatpak安装的应用在`/var/lib/flatpak/app/`目录下，找到对应的软件包目录

```bash
# 进入软件目录
cd /var/lib/flatpak/app/com.github.johnfactotum.Foliate/current/active/export/share
# 拷贝desktop文件
sudo cp applications/com.github.johnfactotum.Foliate.desktop /usr/share/applications/
# 拷贝图标文件
sudo cp -r icons/hicolor /usr/share/icons/
```

#### AppImage

https://appimage.github.io/apps/

该方案感觉比flatpak更方便，无需安装，只需要下载软件appImage包，运行该软件包即可

### ubuntu无法识别u盘

安装exfatprogs工具，自测该工具可以解决问题

```bash
sudo apt install exfatprogs
```

### vscode python无代码提示

python可以安装pylance插件

设置settings，配置如下

```json
"python.defaultInterpreterPath": "/usr/bin/python3", // python路径
"python.analysis.extraPaths": [
    "/home/wwf/.local/lib/python3.10/site-packages" // python本地安装包地址
],
```

### 内存占用过高，系统卡死

物理内存16G，swap分区2G

扩大swap空间

```bash
sudo swapoff -a
sudo fallocate -l 16G /swapfile
sudo mkswap /swapfile
sudo swapon -a
```
