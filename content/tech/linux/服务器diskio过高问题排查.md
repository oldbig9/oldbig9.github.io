---
title: "服务器diskio过高问题排查"
date: 2023-02-09 11:46:31
draft: false
tags:
  - linux
categories:
  - tech
---

## iostat

`iostat -x [间隔秒数] [监控多少秒]`

```bash
$ iostat -x 1 10
avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           1.33    0.08    3.92    3.79    0.00   90.88

Device:         rrqm/s   wrqm/s     r/s     w/s   rsec/s   wsec/s avgrq-sz avgqu-sz   await  svctm  %util
sda              39.00  3854.00 2251.00  581.00 20304.00 35880.00    19.84     2.96    1.02   0.33  94.60
dm-0              0.00     0.00    8.00    0.00  2048.00     0.00   256.00     0.01    0.88   0.88   0.70
dm-1              0.00     0.00    0.00    0.00     0.00     0.00     0.00     0.00    0.00   0.00   0.00
dm-2              0.00     0.00 2281.00 4515.00 18248.00 36120.00     8.00    25.26    3.70   0.14  94.50
```

## iotop

`iotop -oP` // 此命令在服务器上因非 root 用户无权限执行

## pidstat

`pidstat -d [间隔秒数]` // 可以加上 -p [pid] 指定进程

```bash
$ pidstat -d 1
03:23:57          PID   kB_rd/s   kB_wr/s kB_ccwr/s  Command
03:23:58        98848      0.00      3.88      0.00  java

03:23:58          PID   kB_rd/s   kB_wr/s kB_ccwr/s  Command

03:23:59          PID   kB_rd/s   kB_wr/s kB_ccwr/s  Command
03:24:00        98848      0.00     68.00      0.00  java

03:24:00          PID   kB_rd/s   kB_wr/s kB_ccwr/s  Command

03:24:01          PID   kB_rd/s   kB_wr/s kB_ccwr/s  Command
03:24:02        89927      0.00      4.00      0.00  java

03:24:02          PID   kB_rd/s   kB_wr/s kB_ccwr/s  Command

03:24:03          PID   kB_rd/s   kB_wr/s kB_ccwr/s  Command

03:24:04          PID   kB_rd/s   kB_wr/s kB_ccwr/s  Command
```
