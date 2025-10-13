---
weight: 100
title: "Docker搭建本地prometheus监控服务"
description: ""
icon: "article"
date: "2025-10-09T16:42:08+08:00"
lastmod: "2025-10-09T16:42:08+08:00"
draft: true
toc: true
tags:
categories:
- tech
series:
---

## prometheus环境搭建

### docker-compose.yml

```yml
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus-local
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    restart: always

  grafana:
    image: grafana/grafana:latest
    container_name: grafana-local
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
    volumes:
      - ./grafana/data:/var/lib/grafana
    restart: always

  prometheus-gateway:
    image: prom/pushgateway:latest
    container_name: prometheus-gateway-local
    ports:
      - "9091:9091"
    restart: always
```

### prometheus.yml

```yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'pushgateway'
    static_configs:
      - targets: ['prometheus-gateway-local:9091']
```

### 启动docker 容器

`docker compose up -d`

### grafana配置

1. 新建dashboard
2. 配置prometheus数据源,注意数据源地址配置位prometheus容器名称
3. 配置监控面板

## 客户端push监控数据

```go
package main

import (
	"context"
	"log"
	"net/http"
	"time"

	// web框架
	"github.com/gin-gonic/gin"

	// 监控
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/prometheus/client_golang/prometheus/push"

	// 链路追踪
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"
	"go.opentelemetry.io/otel"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"go.opentelemetry.io/otel/trace"
)

var (
	applicationName   = "gin-tmp"
	httpRequestsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Namespace: applicationName,
			Name:      "http_requests_total",
			Help:      "Count of all HTTP requests",
		},
		[]string{"method", "path", "status"},
	)
	httpRequestDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Namespace: applicationName,
			Name:      "http_request_duration_seconds",
			Help:      "Duration of HTTP requests",
			Buckets:   []float64{0.1, 0.3, 0.5, 0.7, 1, 1.5, 2, 3},
		},
		[]string{"method", "path"},
	)
)

func main() {
	otel.SetTracerProvider(sdktrace.NewTracerProvider(sdktrace.WithSampler(sdktrace.ParentBased(sdktrace.AlwaysSample()))))
	r := gin.Default()
	// 使用 Prometheus 中间件
	r.Use(prometheusMiddleware())
	// 使用 OpenTelemetry 中间件
	r.Use(otelgin.Middleware(applicationName))
	// 暴露 /metrics 路由
	r.GET("/metrics", gin.WrapH(promhttp.Handler()))
	// 示例业务路由
	r.GET("/", func(c *gin.Context) {
		foo(c.Request.Context())
		log.Println(GetTraceInfo(c.Request.Context()))
		c.JSON(200, gin.H{"message": "Hello, Prometheus!"})
	})
	r.Run(":8080")
}

func prometheusMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.FullPath()
		c.Next()
		duration := time.Since(start).Seconds()
		status := c.Writer.Status()
		httpRequestsTotal.WithLabelValues(c.Request.Method, path, http.StatusText(status)).Inc()
		httpRequestDuration.WithLabelValues(c.Request.Method, path).Observe(duration)

		// 推送到 Pushgateway
		err := push.New("http://localhost:9091", "gin-tmp").
			Collector(httpRequestsTotal).
			Collector(httpRequestDuration).
			Push()

		if err != nil {
			log.Println("Could not push completion time to Pushgateway:", err)
		}
	}
}

func GetTraceInfo(ctx context.Context) (traceID string, spanID string, isSampled bool) {
	spanCtx := trace.SpanContextFromContext(ctx)

	if spanCtx.HasTraceID() {
		traceID = spanCtx.TraceID().String()
	}
	if spanCtx.HasSpanID() {
		spanID = spanCtx.SpanID().String()
	}

	isSampled = spanCtx.IsSampled()

	return traceID, spanID, isSampled
}

func foo(ctx context.Context) {
	spanCtx := trace.SpanContextFromContext(ctx)
	log.Println(spanCtx.SpanID().String())
}
```