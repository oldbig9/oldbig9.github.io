---
title: "Git常用命令"
date: 2023-05-19 11:23:22
draft: false
tags:
  - Git
categories:
  - tech
---

## 1. 子模块 submodule

git 子模块，引用某个仓库到本项目某个目录下作为自己的子模块,官方 help

```shell
git submodule [--quiet] [--cached]
git submodule [--quiet] add [<options>] [--] <repository> [<path>]
git submodule [--quiet] status [--cached] [--recursive] [--] [<path>...]
git submodule [--quiet] init [--] [<path>...]
git submodule [--quiet] deinit [-f|--force] (--all|[--] <path>...)
git submodule [--quiet] update [<options>] [--] [<path>...]
git submodule [--quiet] set-branch [<options>] [--] <path>
git submodule [--quiet] set-url [--] <path> <newurl>
git submodule [--quiet] summary [<options>] [--] [<path>...]
git submodule [--quiet] foreach [--recursive] <command>
git submodule [--quiet] sync [--recursive] [--] [<path>...]
git submodule [--quiet] absorbgitdirs [--] [<path>...]
```

- 添加子模块

  `git submodule add <repo> <path>`

  该命令会在父项目中创建指定的 path 目录，并将子模块代码 clone 到该目录，父项目中会创建.gitmodules 文件,并修改.git/config 文件

  .gitmodules 记录了子模块信息

  ```git
  [submodule "themes/next"]
  path = themes/next
  url = git@github.com:oldbig9/hexo-theme-next.git
  ```

  .git/config 增加子模块信息

  ```shell
  [submodule "themes/next"]
  url = git@github.com:oldbig9/hexo-theme-next.git
  active = true
  ```

  添加子模块实际的使用场景经常是我们调用第三方的一个项目，我们并不会亲自维护这个项目，并且我们肯定也希望这个项目是稳定的，并且很大可能我们会指定某个 release 分支或者 tag

  指定分支\(未亲自实验是否可行\)

  `git config -f .gitmodules submodule.<path>.branch <branch>`\(git 1.8.2+\)

  然后再进入子模块进行切换分支的操作

  根据官方 help 可以看到有个 set-branch 的操作可选

  `git submodule [--quiet] set-branch [<options>] [--] <path>`

- 更新子模块

  `git submodule update`

- 删除子模块

  删除和添加是相反的过程，相当于将添加子模块带来的修改恢复原样

  ```shell
  git rm --cached moduleA
  rm -rf moduleA
  rm .gitmodules
  vim .git/config
  ```

- clone 带有子模块的 repo

  方式一\:递归 clone

  `git clone <repo> [path] --recursive`

  方式二\:

  ```shell
  git clone project.git [path]
  cd path
  git submodule init
  git submodule update
  ```

- 列出当前项目的子模块

  `git submodule`

  ```shell
  ╭─oldbig9@manjaro in /srv/http/hexo/blog on master ✘ (origin/master)
  ╰$ git submodule
  +c6e732c831532f7ae8a81c16a87cc2ac9dae9ddf themes/next (v7.8.0-11-gc6e732c)
  ```

## 2. 拣选 cherry-pick

cherry-pick 的作用就是拣选某一个分支的 commit，自己经历过的一件事就是某次开发一个功能，里面又有很多小功能，产品要求先上线一个小功能，这时候 cherry-pick 就派上了用场

使用方法\:

`git cherry-pick commit-id [options]`

cherry-pick 常用参数\:

```shell
--abort # 放弃拣选
-n,--no-commit # 不自动提交，这个比较有用，可以仔细查看具体修改了什么
```

cherry-pick 有时并不能自动提交成功，可能存在冲突，需要手动解决冲突后 commit

## 3. 储藏 stash

stash 命令是储藏的意思，当我们希望切换分支但是当前分支有未提交的修改而我们又不想提交时，直接切换分支是行不通的，这时候 stash 命令会帮我们解决这个问题

- 储藏修改

  注意\:这里储藏的只是修改，新增的文件是不会被储藏的

  `git stash save ["comment"]`

- 查看储藏列表

  `git stash list`

- 使用储藏

  `git stash apply stash-order` 不会从 stash 列表中删除该储藏

  `git stash pop stash-order` 使用该储藏，并将该储藏从 stash 列表中删除

## 4. 查看 commit 记录

- `git log` 查看 commit 记录
- `git show commit-id` 查看某个 commit 的修改内容
- `git log <branch-name>` 查看某个分支的commit记录
- `git log -grep=<commit-msg>` 模糊搜索提交信息相关的commit 

## 5. 查看某个文件的修改历史

- `git log filename` 查看某个文件的 commit 记录
- `git log -p filename` 查看某个文件的 commit 记录并展示修改内容
- `git show <commit-id> filename` 查看某个文件某次 commit 修改的内容

## 6. blame

blame 用来查看某个文件某些行的变更记录，很多编辑器或者编辑器插件已经可视化的实现了这个功能，不过还是喜欢使用命令行

使用方式\:

`git blame -L line-start,line-end path-to-file`

## 7. 撤销、回滚

reset 会删除指定 commit 之后的 commit 记录，revert 是通过创建一个新的 commit 来回滚到指定的 commit，指定 commit 之后的 commit 记录会被保留

- `git checkout -- <filename>` 工作区某个文件修改的撤销
- `git checkout -- .` 工作区修改全部撤销
- 撤销文件到指定 commit

  ```shell
  git log <filename>
  git checkout <commit-id> <filename>
  ```

- `git reset <commit-id>` 回退到指定 commit,保留工作区修改，需要重新 commit
- `git reset --hard <commit-d>` 回退到指定 commit，不保留工作区修改
- `git reset --hard HEAD^` 回退到指定最近一次提交
- `git revert <commit-id>` 回滚到指定 commit，会创建一次新的 commit，并保留指定 commit 之后的记录

## 8. 变基 rebase

关于 rebase 没用过，[这篇文章](https://blog.csdn.net/fightfightfight/article/details/81039050)写的比较详细形象

`git pull` 拉取远程分支时相当与执行了下面两个命令

```shell
git fetch <remote>
git merge <remote>/<branch>
```

`git pull --rebase` 相当与以下两个命令

```shell
git fetch <remote>
git rebase <remote>/<branch>
```

可以通过以下配置修改 pull 的默认操作

`git config --global pull.rebase true`

## 9. commit 操作

- 合并 commit

  `git rebase -i HEAD~[要合并的最近几个commit数量]`

  执行后会弹出编辑器，编辑器中会展示出要合并的 commit,将需要合并的 commit 前的 pick 改为 s（squash）

- 修改 commit 注释

  `git commit --amend` 修改最新一次 commit 的注释

  `git rebase -i HEAD~[number]` 修改最近几个 commit 的注释，详细方法实操

## 10. 分支

- `git branch new-branch` 创建分支但并不切换到新分支
- `git checkout -b new-branch` 创建分支并切换到分支
- `git checkout -b new-branch <remote>/<branch-name>` 从远程分支创建本地分支
- `git checkout branch-name` 切换分支
- `git branch -D branch-name` 删除分支
- `git branch -M old-name new-name` 分支重命名

## 11. 标签

- `git tag` 列出标签
- `git tag tag-name` 打标签
- `git clone --branch <tag> <repo>` clone 指定分支代码

## 12. 远程仓库管理

- `git remote add <remote-name> [-t <branch>] [-m <master>] <repo>` 关联远程仓库
- `git remote rename <old> <new>` 重命名远程仓库
- `git remote remove <remote-name>` 删除关联远程仓库
- `git remote get-url <remote-name>` 获取远程仓库地址
- `git remote set-utl origin <repo>` 设置远程仓库地址
- `git remote -v` 查看关联的远程仓库信息

## 13. 取消当前所有新增和修改

```shell
git checkout .
git clean -df
```