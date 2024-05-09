---
title: "SSH连接复用配置"
date: 2023-01-09 21:03:08
draft: false
tags:
- SSH
- Windows
categories:
- tech
---

## SSH配置
```bash
# cd ~/.ssh
# mkdir socks
# vim config 增加如下内容

Host *
    KeepAlive yes
    ServerAliveInterval 60
    ControlMaster auto
    ControlPersist yes
    ControlPath ~/.ssh/socks/%h-%p-%r
```

## 问题
### Windows环境下的配置文件权限问题
Linux下目前没发现该问题，Windows环境报错如下

```powershell
wwf@SK-20210813IYED:~/.ssh$ zssh wwf@whatever.com
Press ^@ (C-Space) to enter file transfer mode, then ? for help

Bad owner or permissions on /home/wwf/.ssh/config
```

错误信息提示为config文件的所属用户或权限错误

**解决方法**

将config文件权限设置为和私钥同一种权限即可
```powershell
chmod 600 config

wwf@SK-20210813IYED:~/.ssh$ ll
total 8
drwx------ 1 wwf wwf 4096 Dec 16 11:03 ./
drwxr-xr-x 1 wwf wwf 4096 Dec 16 11:03 ../
-rw------- 1 wwf wwf  136 Dec 16 10:48 config
-rw------- 1 wwf wwf 2610 Sep  9 11:03 id_rsa
-rw-r--r-- 1 wwf wwf  573 Sep  9 11:03 id_rsa.pub
-rw-r--r-- 1 wwf wwf 2654 Dec 10 16:38 known_hosts
drwxrwxrwx 1 wwf wwf 4096 Dec 16 10:50 socks/
```

### SSH报错 no hostkey alg

在服务器执行scp命令时报错`no hostkey alg`

原因是低版本ssh连接高版本ssh导致的，修改高版本ssh配置增加下面配置即可

`vim /etc/ssh/sshd_condig`

```bash
HostKeyAlgorithms +ssh-rsa,ssh-dss
```

重启sshd服务`sudo systemctl restart sshd`

