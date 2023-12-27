---
weight: 999
title: "使用lumberjack对gorm日志进行分割"
description: ""
icon: "article"
date: "2023-12-27T19:34:44+08:00"
lastmod: "2023-12-27T19:34:44+08:00"
draft: false
toc: true
tag:
- Go
- Gorm
- lumberjack
---

## 示例demo

```go
package mysql

import (
	"log"

	"github.com/natefinch/lumberjack"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func InitMySQL() {
    gormConf := &gorm.Config{
		Logger:      getLogger(),
		QueryFields: true,
	}

    dsn := "xxxxxxx"
    db, err := gorm.Open(mysql.Open(dsn), gormConf)

    //.......
}

func getLogger() logger.Interface {
    lg := logger.New(getLogWriter(), logger.Config{
		SlowThreshold:             50 * time.Millisecond,
		Colorful:                  false,
		IgnoreRecordNotFoundError: false,
		LogLevel:                  logger.Silent,
	})

    return lg
}

func getLogWriter() logger.Writer {
	writer := &lumberjack.Logger{
		Filename:   "xxx",  // 日志文件地址
		MaxSize:    500,    // 500MB 
		MaxBackups: 5,      // 分割文件数量
		MaxAge:     5,      // 保存天数
		Compress:   false,  // 是否压缩日志
	}

    return log.New(writer, "\n", log.LstdFlags)

	return 
}
```