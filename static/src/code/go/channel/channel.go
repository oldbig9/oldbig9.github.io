package main

import (
	"fmt"
	"time"
)

func main() {
	in := make(chan int, 2)
	out := make(chan int)
	go ascyncProcess(in, out)
	in <- 1
	in <- foo()
	// for {
	select {
	case v := <-out:
		fmt.Println(v)
	case <-time.After(time.Second):
		goto LOOP
	}
	// }

LOOP:
	fmt.Println("timeout")

}

func process(val int) int {
	return val + 1
}

func ascyncProcess(in <-chan int, out chan<- int) {
	for val := range in {
		result := process(val)
		out <- result
	}
}

func foo() int {
	time.Sleep(time.Second * 10)
	return 9
}
