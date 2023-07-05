---
title: "Zap日志包"
date: 2023-07-03 14:01:09
draft: false
tags:
- Go
categories:
- tech
---

## [zap](https://github.com/uber-go/zap)

`go get -u go.uber.org/zap`

## 初始化logger

```go
package logs

import (
	"os"

	"github.com/natefinch/lumberjack"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func InitLogger() {
    // 生产环境encoderConfig
	encoderConfig := zap.NewProductionEncoderConfig()
	// 设置日志记录中时间的格式
	encoderConfig.EncodeTime = zapcore.TimeEncoderOfLayout("2006-01-02 15:04:05.000")
	encoderConfig.FunctionKey = "func"
	encoderConfig.CallerKey = "caller"
    // 日志json格式输出
    encoder = zapcore.NewJSONEncoder(encoderConfig)

    // 多文件输出
    cores := make([]zapcore.Core, 0, len(config.WriteSyncers))
    cores = append(cores, zapcore.NewCore(encoder, os.Stdout, zap.DebugLevel))
    cores = append(cores, zapcore.NewCore(encoder, getWriteSyncer("./run.log"), zap.InfoLevel))
    cores = append(cores, zapcore.NewCore(encoder, getWriteSyncer("./warn.log"), zap.WarnLevel))

    core := zapcore.NewTree(cores...)
    logger := zap.New(core)
    // 输出caller， AddCallerSkip(1)用户输出正确的log调用方
	logger = logger.WithOptions(zap.AddCaller(), zap.AddCallerSkip(1))
	defer logger.Sync()
	zap.ReplaceGlobals(logger) // 使用初始化后的logger替换zap全局logger，后续可以使用zap.S() 或者 zap.L()获取全局logger
}

// 分割日志
func getWriteSyncer(filepath string) zapcore.WriteSyncer {
	logger := &lumberjack.Logger{
		Filename:   filepath,
		MaxSize:    500, // 500MB
		MaxAge:     10,  // 10 day
		MaxBackups: 30,  // 30 files
		LocalTime:  true,
		Compress:   true,
	}

	return zapcore.AddSync(logger)
}
```

## 封装log方法

统一增加traceId field, 通过context.Context传递traceId，方便日志追踪
 
```go
package logs

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

type traceKey string

var ctxTraceKey = traceKey("traceId")

const (
	fieldTraceId = "traceId"
)

func AddContextTrace(ctxs ...context.Context) context.Context {
	ctx := context.Background()
	if len(ctxs) > 0 {
		ctx = ctxs[0]
	}
	ctx = context.WithValue(ctx, ctxTraceKey, uuid.NewString())

	return ctx
}

func Debug(ctx context.Context, args ...interface{}) {
	getLogger().With(fieldTraceId, getTraceId(ctx)).Debug(args...)
}

func Info(ctx context.Context, args ...interface{}) {
	getLogger().With(fieldTraceId, getTraceId(ctx)).Info(args...)
}

func getLogger() *zap.SugaredLogger {
	return zap.S()
}

func getTraceId(ctx context.Context) string {
	traceId := ctx.Value(ctxTraceKey)

	if v, ok := traceId.(string); ok {
		return v
	}

	return ""
}
```