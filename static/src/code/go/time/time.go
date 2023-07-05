package main

import (
	"fmt"
	"time"
)

func main() {
	t1 := time.Now()
	t2 := t1.Add(10 * time.Minute)

	fmt.Println(t2.Sub(t1).Seconds())       // 600
	fmt.Println(t1.Sub(t2).Abs().Seconds()) // 600, Abs() added in Go v1.19
}
