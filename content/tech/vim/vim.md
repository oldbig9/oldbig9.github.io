---
title: "Vim"
date: 2023-01-31 19:17:47
draft: false
tags:
- vim
categories:
- tech
---

## 配置

`vim ~/.vimrc`

```bash
syntax on
set encoding=utf-8
set number
set tabstop=4
set softtabstop=4
set shiftwidth=4
set smartindent
set showmatch
"set list
"set listchars=tab:\|\ ,trail:.,extends:>,precedes:<
set cursorline
hi CursorLine   cterm=NONE ctermbg=darkred ctermfg=white guibg=darkred guifg=white
set cursorcolumn
hi CursorColumn cterm=NONE ctermbg=darkred ctermfg=white guibg=darkred guifg=white

call plug#begin()
Plug 'fatih/vim-go'
Plug 'preservim/nerdtree'
"Ctrl+n展示左侧目录树
map <C-n> :NERDTreeToggle<CR>
call plug#end()
```

## 插件管理

### vim-plug

安装：[vim-plug](https://github.com/junegunn/vim-plug)

```bash
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

添加插件

`vim ~/.vimrc`
```bash
call plug#begin()
Plug 'fatih/vim-go'
call plug#end()
```

添加之后执行如下命令
```bash
$ vim
$ :PlugInstall
# 更新命令是PlugUpdate
```

### 常用插件

#### vim-go

gopls问题
```shell
vim-go: could not find 'gopls'. Run :GoInstallBinaries to fix it
```
按要求执行 GoInstallBinaries命令，报如下错误
```shell
vim-go: revive not found. Installing github.com/mgechev/revive@latest to folder /home/wwf/go/bin/
vim-go: guru not found. Installing golang.org/x/tools/cmd/guru@master to folder /home/wwf/go/bin/
vim-go: gopls not found. Installing golang.org/x/tools/gopls@latest to folder /home/wwf/go/bin/
```

原因应该是GOPATH和GO mod的问题
手动go get上述三个包解决问题

#### nerdtree

```bash
call plug#begin()
Plug 'preservim/nerdtree'
map <C-n> :NERDTreeToggle<CR> 
call plug#end()
```