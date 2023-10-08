---
title: "Sentinel Golang"
date: 2023-08-18 18:57:28
draft: false
tags:
- Go
- sentinel
categories:
- tech
---


## 限流规则

```go
// Strategy
type TokenCalculateStrategy int32

const (
	Direct TokenCalculateStrategy = iota
	WarmUp
	MemoryAdaptive
)

// Rule describes the strategy of flow control, the flow control strategy is based on QPS statistic metric
type Rule struct {
	// ID represents the unique ID of the rule (optional).
	ID string `json:"id,omitempty"`
	// Resource represents the resource name.
	Resource               string                 `json:"resource"`
	TokenCalculateStrategy TokenCalculateStrategy `json:"tokenCalculateStrategy"`
	ControlBehavior        ControlBehavior        `json:"controlBehavior"`
	// Threshold means the threshold during StatIntervalInMs
	// If StatIntervalInMs is 1000(1 second), Threshold means QPS
	Threshold        float64          `json:"threshold"`
	RelationStrategy RelationStrategy `json:"relationStrategy"`
	RefResource      string           `json:"refResource"`
	// MaxQueueingTimeMs only takes effect when ControlBehavior is Throttling.
	// When MaxQueueingTimeMs is 0, it means Throttling only controls interval of requests,
	// and requests exceeding the threshold will be rejected directly.
	MaxQueueingTimeMs uint32 `json:"maxQueueingTimeMs"`
	WarmUpPeriodSec   uint32 `json:"warmUpPeriodSec"`
	WarmUpColdFactor  uint32 `json:"warmUpColdFactor"`
	// StatIntervalInMs indicates the statistic interval and it's the optional setting for flow Rule.
	// If user doesn't set StatIntervalInMs, that means using default metric statistic of resource.
	// If the StatIntervalInMs user specifies can not reuse the global statistic of resource,
	// 		sentinel will generate independent statistic structure for this rule.
	StatIntervalInMs uint32 `json:"statIntervalInMs"`

	// adaptive flow control algorithm related parameters
	// limitation: LowMemUsageThreshold > HighMemUsageThreshold && MemHighWaterMarkBytes > MemLowWaterMarkBytes
	// if the current memory usage is less than or equals to MemLowWaterMarkBytes, threshold == LowMemUsageThreshold
	// if the current memory usage is more than or equals to MemHighWaterMarkBytes, threshold == HighMemUsageThreshold
	// if  the current memory usage is in (MemLowWaterMarkBytes, MemHighWaterMarkBytes), threshold is in (HighMemUsageThreshold, LowMemUsageThreshold)
	LowMemUsageThreshold  int64 `json:"lowMemUsageThreshold"`
	HighMemUsageThreshold int64 `json:"highMemUsageThreshold"`
	MemLowWaterMarkBytes  int64 `json:"memLowWaterMarkBytes"`
	MemHighWaterMarkBytes int64 `json:"memHighWaterMarkBytes"`
}
```

## 熔断规则

[熔断规则](https://github.com/alibaba/sentinel-golang/wiki/%E7%86%94%E6%96%AD%E9%99%8D%E7%BA%A7#%E6%9C%80%E4%BD%B3%E5%9C%BA%E6%99%AF%E5%AE%9E%E8%B7%B5)

```go
// Strategy
type Strategy uint32

// 熔断策略
const (
	SlowRequestRatio Strategy = iota // 慢调用比例
	ErrorRatio // 错误比例
	ErrorCount // 错误数量
)

// Rule encompasses the fields of circuit breaking rule.
// Resource、Strategy、RetryTimeoutMs、MinRequestAmount、StatIntervalMs、Threshold 每个规则都必设的字段，MaxAllowedRtMs是慢调用比例熔断规则必设的字段。
// MaxAllowedRtMs 字段仅仅对慢调用比例 (SlowRequestRatio) 策略有效，对其余策略均属于无效字段。
// StatIntervalMs 表示熔断器的统计周期，单位是毫秒，这个值我们不建议设置的太大或则太小，一般情况下设置10秒左右都OK，当然也要根据实际情况来适当调整。
// RetryTimeoutMs 的设置需要根据实际情况设置探测周期，一般情况下设置10秒左右都OK，当然也要根据实际情况来适当调整。

type Rule struct {
	// unique id
	Id string `json:"id,omitempty"`
	// resource name
	Resource string   `json:"resource"` // 熔断器规则生效的埋点资源的名称
	Strategy Strategy `json:"strategy"` // 熔断策略，目前支持SlowRequestRatio、ErrorRatio、ErrorCount三种；选择以慢调用比例 (SlowRequestRatio) 作为阈值，需要设置允许的最大响应时间（MaxAllowedRtMs），请求的响应时间大于该值则统计为慢调用。通过 Threshold 字段设置触发熔断的慢调用比例，取值范围为 [0.0, 1.0]。规则配置后，在单位统计时长内请求数目大于设置的最小请求数目，并且慢调用的比例大于阈值，则接下来的熔断时长内请求会自动被熔断。经过熔断时长后熔断器会进入探测恢复状态，若接下来的一个请求响应时间小于设置的最大 RT 则结束熔断，若大于设置的最大 RT 则会再次被熔断。选择以错误比例 (ErrorRatio) 作为阈值，需要设置触发熔断的异常比例（Threshold），取值范围为 [0.0, 1.0]。规则配置后，在单位统计时长内请求数目大于设置的最小请求数目，并且异常的比例大于阈值，则接下来的熔断时长内请求会自动被熔断。经过熔断时长后熔断器会进入探测恢复状态，若接下来的一个请求没有错误则结束熔断，否则会再次被熔断。代码中可以通过 api.TraceError(entry, err) 函数来记录 error
	RetryTimeoutMs uint32 `json:"retryTimeoutMs"` // 即熔断触发后持续的时间（单位为 ms）。资源进入熔断状态后，在配置的熔断时长内，请求都会快速失败。熔断结束后进入探测恢复模式（HALF-OPEN)
	MinRequestAmount uint64 `json:"minRequestAmount"` // 静默数量，如果当前统计周期内对资源的访问数量小于静默数量，那么熔断器就处于静默期。换言之，也就是触发熔断的最小请求数目，若当前统计周期内的请求数小于此值，即使达到熔断条件规则也不会触发。
	StatIntervalMs uint32 `json:"statIntervalMs"` // 统计的时间窗口长度（单位为 ms）。
	// StatSlidingWindowBucketCount represents the bucket count of statistic sliding window.
	// The statistic will be more precise as the bucket count increases, but the memory cost increases too.
	// The following must be true — “StatIntervalMs % StatSlidingWindowBucketCount == 0”,
	// otherwise StatSlidingWindowBucketCount will be replaced by 1.
	// If it is not set, default value 1 will be used.
	StatSlidingWindowBucketCount uint32 `json:"statSlidingWindowBucketCount"`
	MaxAllowedRtMs uint64 `json:"maxAllowedRtMs"` // 仅对慢调用熔断策略生效，MaxAllowedRtMs 是判断请求是否是慢调用的临界值，也就是如果请求的response time小于或等于MaxAllowedRtMs，那么就不是慢调用；如果response time大于MaxAllowedRtMs，那么当前请求就属于慢调用。
	Threshold float64 `json:"threshold"` // 对于慢调用熔断策略, Threshold表示是慢调用比例的阈值(小数表示，比如0.1表示10%)，也就是如果当前资源的慢调用比例如果高于Threshold，那么熔断器就会断开；否则保持闭合状态。 对于错误比例策略，Threshold表示的是错误比例的阈值(小数表示，比如0.1表示10%)。对于错误数策略，Threshold是错误计数的阈值
	//ProbeNum is number of probes required when the circuit breaker is half-open.
	//when the probe num are set  and circuit breaker in the half-open state.
	//if err occurs during the probe, the circuit breaker is opened immediately.
	//otherwise,the circuit breaker is closed only after the number of probes is reached
	ProbeNum uint64 `json:"probeNum"`
}
```

