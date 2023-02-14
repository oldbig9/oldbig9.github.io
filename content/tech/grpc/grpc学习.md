---
title: "Grpc学习"
date: 2023-02-13 19:47:48
draft: false
tags:
- Go
- grpc
categories:
- tech
---

## 依赖

protoc
```bash
wget https://github.com/protocolbuffers/protobuf/releases/download/v21.12/protoc-21.12-linux-x86_64.zip

unzip protoc-21.12-linux-x86_64.zip
cd protoc-21.12-linux-x86_64

./configure
make
sudo make install
```

protoc-gen-go、protoc-gen-go-grpc
```bash
$ go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
$ go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
```

## grpc-go

代码仓库：[https://github.com/grpc/grpc-go](https://github.com/grpc/grpc-go)

文档：[https://grpc.io/docs/languages/go/](https://grpc.io/docs/languages/go/)

克隆项目
```bash
git clone https://github.com/grpc/grpc-go.git
```

项目导入
```go
import "google.golang.org/grpc"
```

go安装依赖包
```bash
go get -u google.golang.org/grpc
```

生成pb代码
```bash
protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
    helloworld/helloworld.proto
```

