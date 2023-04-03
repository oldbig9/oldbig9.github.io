---
title: "常用shell命令"
date: 2023-04-03 15:45:58
draft: false
tags:
  - shell
categories:
  - tech
---

## 获取毫秒时间戳

```shell
tsp=$[$(date +%s%N)/1000000]
echo $tsp
```

## 获取字符串MD5值

```shell
str='test'
# echo -n 去掉换行
md5=`echo -n "$str" | md5sum | cut -d ' ' -f1`
echo $md5
```

## 判断文件中是否包含字符串
```shell
str='test'
desFile='./content/tech/shell/常用shell命令.md'
if [ `grep -c "$str" "$desFile"` -ne '0' ]; then
    echo '存在'
else
    echo '不存在'
fi
```

## sed替换文件中内容
```shell
str='test'
replace='ttttttt'
desFile='./content/tech/shell/常用shell命令.md'
if [ `grep -c "$str" "$desFile"` -ne '0' ]; then
    #sed -i 's/'"$str"'/'"$replace"'/g' $desFile
    sed -i "s/${str}/${replace}/g" $desFile
fi
```
sed 中使用变量
方式1：单引号包裹双引号
方式2：使用双引号，变量直接引用
