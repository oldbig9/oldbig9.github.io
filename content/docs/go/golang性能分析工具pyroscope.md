---
weight: 100
title: "golang性能分析工具Pyroscope"
description: "持续性能分析工具，帮助定位 Go 应用的性能瓶颈"
icon: "article"
date: "2026-01-27T17:21:44+08:00"
lastmod: "2026-01-27T17:21:44+08:00"
draft: true
toc: true
tags:
- golang
- profiling
categories:
- tech
series:
---

Pyroscope 是 Grafana 开源的持续性能分析平台，支持 Go、Python、Java 等多种语言。

项目地址：[https://github.com/grafana/pyroscope](https://github.com/grafana/pyroscope)

## 为什么选择 Pyroscope

相比 Go 原生的 `runtime/pprof`，Pyroscope 的核心价值在于**持续性能分析**。

| 特性 | runtime/pprof | Pyroscope |
|------|---------------|-----------|
| **采集方式** | 手动触发，单次快照 | 持续自动采集 |
| **数据存储** | 本地文件，用完即弃 | 时间序列存储，保留历史数据 |
| **可视化** | 需要 `go tool pprof` 命令行分析 | 内置 Web UI，Grafana 集成 |
| **多实例** | 每个实例独立，需手动汇总 | 通过标签聚合多实例数据 |
| **时间对比** | 手动对比不同快照文件 | 内置时间范围对比，方便排查性能回归 |
| **生产安全** | 开放 pprof HTTP endpoint 有风险 | Push 模式，无需暴露端口 |

简单说：`runtime/pprof` 是"手动拍照"，Pyroscope 是"24小时监控录像"。当线上出现性能问题时，你可以直接查看问题发生时刻的性能数据，回溯分析。

## 快速开始

### 部署 Pyroscope Server

使用 Docker Compose 部署 Pyroscope 和 Grafana：

```yml
version: '3'
services:
  pyroscope:
    image: grafana/pyroscope
    ports:
      - "4040:4040"
  
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_INSTALL_PLUGINS=grafana-pyroscope-app
```

> 在 Grafana 中查看火焰图，使用 **Explore** 或 **Drilldown** 功能，Datasource 地址设置为 `http://host.docker.internal:4040`

### 接入 Go 应用

```go
import (
	"os"
	"runtime"

	"github.com/grafana/pyroscope-go"
)

func main() {
	initPyroscope()
	// ...
}

func initPyroscope() {
	runtime.SetMutexProfileFraction(5)
	runtime.SetBlockProfileRate(5)
	
	pyroscope.Start(pyroscope.Config{
		ApplicationName: "my-app",
		ServerAddress:   "http://localhost:4040",
		Logger:          pyroscope.StandardLogger,
		Tags:            map[string]string{"hostname": os.Getenv("HOSTNAME")},
		ProfileTypes: []pyroscope.ProfileType{
			pyroscope.ProfileCPU,
			pyroscope.ProfileAllocObjects,
			pyroscope.ProfileAllocSpace,
			pyroscope.ProfileInuseObjects,
			pyroscope.ProfileInuseSpace,
			pyroscope.ProfileGoroutines,
			pyroscope.ProfileMutexCount,
			pyroscope.ProfileMutexDuration,
			pyroscope.ProfileBlockCount,
			pyroscope.ProfileBlockDuration,
		},
	})
}
```

## Profile 指标说明

### CPU

| 指标 | 说明 |
|------|------|
| **ProfileCPU** | 采集 CPU 使用情况，显示哪些函数消耗了最多的 CPU 时间 |

### 内存

| 指标 | 说明 |
|------|------|
| **ProfileAllocObjects** | 累计分配的对象数量，用于发现频繁分配对象的代码路径 |
| **ProfileAllocSpace** | 累计分配的内存字节数，用于定位内存分配热点 |
| **ProfileInuseObjects** | 当前使用中（未被 GC 回收）的对象数量 |
| **ProfileInuseSpace** | 当前使用中的内存字节数，用于发现内存泄漏 |

> **Alloc vs Inuse**：`Alloc` 是累计值（包含已回收的），`Inuse` 是当前快照值

### 并发

| 指标 | 说明 |
|------|------|
| **ProfileGoroutines** | Goroutine 数量及调用栈，用于发现 goroutine 泄漏 |
| **ProfileMutexCount** | 互斥锁竞争次数 |
| **ProfileMutexDuration** | 等待互斥锁的累计时间，用于定位锁竞争热点 |
| **ProfileBlockCount** | 阻塞操作次数（channel、select、sync 等） |
| **ProfileBlockDuration** | 阻塞操作的累计等待时间 |

> Mutex 和 Block 分析需要提前开启采样：
> ```go
> runtime.SetMutexProfileFraction(5)  // 1/5 的 mutex 竞争事件会被采样
> runtime.SetBlockProfileRate(5)      // 阻塞超过 5 纳秒的事件会被记录
> ```

## 问题排查指南

| 问题类型 | 应关注的指标 |
|----------|-------------|
| CPU 占用高 | ProfileCPU |
| 内存增长/泄漏 | ProfileInuseSpace, ProfileInuseObjects |
| GC 压力大 | ProfileAllocObjects, ProfileAllocSpace |
| Goroutine 泄漏 | ProfileGoroutines |
| 锁竞争/死锁 | ProfileMutexCount, ProfileMutexDuration |
| Channel/IO 阻塞 | ProfileBlockCount, ProfileBlockDuration |

## 效果展示

在 Grafana Drilldown 中查看火焰图：

![Pyroscope Drilldown](/images/pyroscope-drilldown.png)
