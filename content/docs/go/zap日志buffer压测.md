---
weight: 100
title: "Zap日志buffer压测"
description: ""
icon: "article"
date: "2025-12-19T23:01:59+08:00"
lastmod: "2025-12-19T23:01:59+08:00"
draft: true
toc: true
tags:
categories:
- tech
series:
---

## 带缓冲日志

### 初始化logger

```go
package log

import (
	"context"
	"time"

	"go.opentelemetry.io/otel/trace"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
)

var logger *zap.Logger
var bufferedWS *zapcore.BufferedWriteSyncer

// InitLogger 初始化 logger 并返回 *zap.Logger
// @bufferSize int 缓冲大小，单位kb
func InitLogger(bufferSize int) (*zap.Logger, error) {
	// 使用 lumberjack 作为文件滚动写入器
	lj := &lumberjack.Logger{
		Filename:   "app.log",
		MaxSize:    500, // MB
		MaxBackups: 10,
		MaxAge:     28,    // days
		Compress:   false, // gzip
	}

	// 用 BufferedWriteSyncer 包裹，设置缓冲大小和刷新间隔
	bufferedWS = &zapcore.BufferedWriteSyncer{
		WS:            zapcore.AddSync(lj),
		Size:          bufferSize * 1024, // 512KB 缓冲
		FlushInterval: 30 * time.Second,  // 每 30s 自动刷新一次
	}

	// encoder 配置
	cfg := zap.NewProductionEncoderConfig()
	cfg.EncodeTime = zapcore.ISO8601TimeEncoder
	encoder := zapcore.NewJSONEncoder(cfg)

	// 日志级别
	level := zap.NewAtomicLevelAt(zap.InfoLevel)

	// core
	core := zapcore.NewCore(encoder, bufferedWS, level)

	// 返回 logger，调用方负责在程序退出时调用 CloseLogger()
	logger = zap.New(core, zap.AddCaller(), zap.AddCallerSkip(1), zap.AddStacktrace(zap.FatalLevel))
	return logger, nil
}

// CloseLogger 用于在程序退出时停止缓冲并刷新数据
func CloseLogger() error {
	if bufferedWS != nil && bufferedWS.WS != nil {
		return bufferedWS.Stop()
	}
	return nil
}
```

### 压测文件

```go
// ...existing code...
package log

import (
	"strings"
	"testing"
)

func BenchmarkLoggerWithBuffer(b *testing.B) {
	msg := strings.Repeat("a", 200) // 日志内容长度
    bufferSize := 4 // 缓冲区大小
	logger, err := InitLogger(bufferSize)
	if err != nil {
		b.Fatalf("InitLogger failed: %v", err)
	}
	defer logger.Sync()
	for b.Loop() {
		logger.Info(msg)
	}
}

```

压测结果可见，消息内容长度为
```bash
# msg length 200 chars, buffer 4KB
$ go test -benchmem -run=^$ -bench ^BenchmarkLoggerWithBuffer$ demo/pkg/log -v
goos: darwin
goarch: arm64
pkg: demo/pkg/log
cpu: Apple M2
BenchmarkLoggerWithBuffer
BenchmarkLoggerWithBuffer-8      1046751              1119 ns/op             264 B/op          2 allocs/op
PASS
ok      demo/pkg/log    1.368s

# msg length 200 chars, buffer 32KB
$ go test -benchmem -run=^$ -bench ^BenchmarkLoggerWithBuffer$ demo/pkg/log -v
goos: darwin
goarch: arm64
pkg: demo/pkg/log
cpu: Apple M2
BenchmarkLoggerWithBuffer
BenchmarkLoggerWithBuffer-8      1189330               988.0 ns/op           264 B/op          2 allocs/op
PASS
ok      demo/pkg/log    1.369s
```