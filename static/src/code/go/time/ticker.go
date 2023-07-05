package main

import (
	"fmt"
	"time"
)

func main() {
	t := time.NewTicker(time.Second) // 1秒间隔的定时器，类似js的setInterval()方法
	defer t.Stop()
	timeout := time.NewTimer(10 * time.Second) // 10秒定时器，类似js的setTimeout()方法

	for {
		select {
		case <-timeout.C:
			fmt.Println("timeout")
			return
		case curr := <-t.C:
			fmt.Println("current timestamp:", curr.Unix())
		}
	}
}
