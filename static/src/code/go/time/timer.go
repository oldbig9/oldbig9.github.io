package main

import (
	"fmt"
	"time"
)

func main() {
	_ = time.AfterFunc(time.Second*5, foo)
	timer := time.NewTimer(10 * time.Second)
	for {
		select {
		case <-timer.C:
			fmt.Println("timeout")
			goto LOOP
		}
	}

LOOP:
	fmt.Println("end")

}

func foo() {
	fmt.Println("fooooooo...")
}
