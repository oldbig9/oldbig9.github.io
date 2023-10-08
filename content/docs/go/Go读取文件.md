---
title: "Go读取文件"
date: 2023-04-07 11:54:43
draft: false
tags:
- Go
categories:
- tech
---

## 读取文件全部内容

ioutil.ReadFile(filename string)

```go
package main

import (
    "fmt"
    "io/ioutil"
)

func main(){
    content, err := ioutil.ReadFile("test.txt")
    if err != nil {
        fmt.Printf("read file failed, %v\n", err)
    } else {
        fmt.Printf("file content: %s", string(content))
    }
}
```

## 按行读取

```go
package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
)

func main() {
	fp, err := os.Open("channel.go")
	if err != nil {
		log.Fatal("open file failed, %v", err)
	}

	defer fp.Close()

	scanner := bufio.NewScanner(fp)

	for scanner.Scan() {
		fmt.Println(scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
}
```

