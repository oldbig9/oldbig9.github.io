---
title: "WSL设置PATH不生效问题"
date: 2023-01-09 21:14:05
draft: false
tags:
- WSL
categories:
- tech
---


## WSL配置添加GOBIN到PATH不生效
环境：WSL1+ZSH

```shell
# vim ~/.zshrc

export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
```
执行`source ~/.zshrc`后，该设置在当前中端生效，打开新的中端则不生效


解决方法，修改/etc/profile
```shell
# vim /etc/profile

if [ "${PS1-}" ]; then
  if [ "${BASH-}" ] && [ "$BASH" != "/bin/sh" ]; then
    # The file bash.bashrc already sets the default PS1.
    # PS1='\h:\w\$ '
    if [ -f /etc/bash.bashrc ]; then
      . /etc/bash.bashrc
    fi
  # 新增下面两行
  elif [ -f /etc/zsh/zshrc ]; then
      . /etc/zsh/zshrc
  else
    if [ "$(id -u)" -eq 0 ]; then
      PS1='# '
    else
      PS1='$ '
    fi
  fi
fi

if [ -d /etc/profile.d ]; then
  for i in /etc/profile.d/*.sh; do
    if [ -r $i ]; then
      . $i
    fi
  done
  unset i
fi
```

`source /etc/profile`