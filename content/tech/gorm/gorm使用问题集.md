---
title: "gorm使用问题集"
date: 2023-01-12 11:04:23
draft: false
tags:
- gorm
categories:
- tech
---

## gorm连接被mysql server断开

### 报错如下
```shell
[mysql] 2023/01/11 16:41:19 packets.go:122: closing bad idle connection: EOF 
```

### 查看MySQL服务器连接超时时间, 28800s(8小时)
```shell
mysql> show global variables like 'wait_timeout';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| wait_timeout  | 28800 |
+---------------+-------+
```


### 连接池设置

默认情况下，gorm客户端最大连接时间为0，即不主动断开连接
```go
sqlDB, err := db.DB()

// SetMaxIdleConns 设置空闲连接池中连接的最大数量
sqlDB.SetMaxIdleConns(10)

// SetMaxOpenConns 设置打开数据库连接的最大数量。
sqlDB.SetMaxOpenConns(100)

// SetConnMaxLifetime 设置了连接可复用的最大时间。
sqlDB.SetConnMaxLifetime(time.Hour) // 不设置则默认为0，即客户端不断开连接

// 获取连接实例状态
sqlDB.Stats()
```

### 设置连接最大复用时间源码

标准库database/sql/sql.go go版本 v1.18.9

设置最大连接时间后，客户端会启动清理超时连接的协程，超时后主动断开连接

```go
// SetConnMaxLifetime sets the maximum amount of time a connection may be reused.
//
// Expired connections may be closed lazily before reuse.
//
// If d <= 0, connections are not closed due to a connection's age.
func (db *DB) SetConnMaxLifetime(d time.Duration) {
	if d < 0 {
		d = 0
	}
	db.mu.Lock()
	// Wake cleaner up when lifetime is shortened.
	if d > 0 && d < db.maxLifetime && db.cleanerCh != nil {
		select {
		case db.cleanerCh <- struct{}{}:
		default:
		}
	}
	db.maxLifetime = d
	db.startCleanerLocked()
	db.mu.Unlock()
}
```

### 解决方式

获取DB实例时，若实例Ping()失败则重新建立连接
```go
var db *gorm.DB
...
func GetDB() *gorm.DB {
	sqlDB, err := db.DB()
	if err != nil {
		// do something
	}

	if err := sqlDB.Ping(); err != nil {
		// 重新建立连接
	}
}
```