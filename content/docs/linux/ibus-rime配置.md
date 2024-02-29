---
title: "ubuntu ibus rime配置"
date: 2024-01-11 10:23:08
draft: false
tags:
  - Ubuntu
  - ibus
  - rime
  - Linux
categories:
  - tech
---

## 安装rime输入法

安装比较简单，执行下面命令即可

```bash
sudo apt install ibus-rime
```
这就安装完了？对也不对，输入法目前的确可以用了，但是你会发现这个输入法怎么这么难用，候选词也太不准确了，mmp

其实是你没有进行进一步的配置，原来我就只到这步为止了，是我错怪rime了

但是奇怪的是rime既然提供了ubuntu的安装包，为什么没有直接将词库预置进去

## 配置rime

### 词库

网上有不少关于rime怎么扩展词库的，还有从搜狗或者其他输入法的词库扩展，步骤还比较繁琐

其实完全没有必要，使用官方的配置工具[plum](https://github.com/rime/plum)配置之后，你会发现，rime官方提供的词库足以满足日常需要，相当nice，又可以愉快的码字了

```bash
git clone --depth 1 https://github.com/rime/plum.git
cd plum
bash rime-install :all
```
查看配置目录会发现词库luna_pinyin.dict.yaml已经存在了

```bash
╭─wwf@ubuntu in ~/.config/ibus/rime 
╰$ ll luna_pinyin.dict.yaml 
-rw-rw-r-- 1 wwf wwf 870K  2月  1 14:48 luna_pinyin.dict.yaml
```

### 外观定制

默认使用的`朙月拼音`输入法

> 朙: míng，同明，异体字

gnome也有一些图形化配置ibus的扩展，但是按照官方文档进行配置也同样可以实现

[Rime定制指南](https://github.com/rime/home/wiki/CustomizationGuide#rime-%E5%AE%9A%E8%A3%BD%E6%8C%87%E5%8D%97)

[在线主题配色定制](https://bennyyip.github.io/Rime-See-Me/)

官方文档中的定制方案也可以满足你的大部分需求
- 候选词数量
- 中文输入法下直接输入顿号
- 候选词字体大小(未生效)
- 切换输入法快捷键配置(默认的与vscode打开终端快捷键冲突)
- 候选词水平显示(朙月拼音配置后并未生效，待研究，不过还好不是最重要的)
- 面板配色(同样未生效，也同样不重要)

虽然有一些配置并没有按照预期工作，但是已经很好了，尤其是候选词这块，输入多个拼音的情况下，绝大部分第一位候选词就是你想要的，非常nice