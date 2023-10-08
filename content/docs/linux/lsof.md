---
title: "lsof"
date: 2023-01-28 12:55:51
draft: false
tags:
  - linux
categories:
  - tech
---

## lsof 输出各列信息

| column   | 描述                         |
| -------- | ---------------------------- |
| COMMAND  | 进程名称                     |
| PID      | 进程 ID                      |
| USER     | 进程所属用户                 |
| FD       | 文件描述符                   |
| TYPE     | 文件类型，IPv4, REG 等       |
| DEVICE   | 磁盘名称                     |
| SIZE/OFF | 文件大小                     |
| NODE     | 索引节点，文件在磁盘上的标识 |
| NAME     | 打开文件的名称               |

## 查看打开文件的进程

`lsof [filename]`

```bash
$ lsof ~/log/php/access.log
COMMAND   PID USER   FD   TYPE DEVICE  SIZE/OFF     NODE NAME
php-fpm 23071 work    4w   REG 252,16 133473826 11142186 /home/work/log/php/access.log
php-fpm 23072 work    4w   REG 252,16 133473826 11142186 /home/work/log/php/access.log
```

## 显示目录下被打开的文件

`lsof +d [dir]`

`lsof +D [dir]` // 会递归搜索目录下的目录

## 查看使用端口的进程

`lsof -i:[port]`

## 查看打开了具体连接的进程

`lsof -i [protocol][@hostname|hostaddr][:service|port]`

```bash
$ lsof -i tcp@localhost:7916
```

## 查看进程打开的文件

`lsof -p [pid]`

`lsof -c [service name]`

## 查看被删除但文件句柄未释放的文件

`lsof | grep -i deleted`
