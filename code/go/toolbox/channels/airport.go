package channels

import (
	"fmt"
	"time"
)

const (
	timeCostIdCheck   = 60
	timeCostBodyCheck = 120
	timeCostXrayCheck = 240
)

func AirPort() {
	passengers := 30
	serialCheck(passengers)
	concurrencyCheck(passengers)
}

func concurrencyCheck(passengers int) {
	total := 0
	queue := make(chan struct{})
	c1 := start(1, airportCheck, queue)
	c2 := start(2, airportCheck, queue)
	c3 := start(3, airportCheck, queue)

	for i := 1; i <= passengers; i++ {
		queue <- struct{}{}
	}
	close(queue)

	total = max(<-c1, <-c2, <-c3)
	fmt.Println("concurrencyCheck cost: ", total, " ms")
}

func start(id int, f func(int) int, queue <-chan struct{}) <-chan int {
	c := make(chan int)
	go func() {
		total := 0
		for {
			_, ok := <-queue
			if !ok {
				c <- total
				return
			}
			total += f(id)
		}
	}()

	return c
}

func max(args ...int) int {
	n := 0
	for _, v := range args {
		if v > n {
			n = v
		}
	}

	return n
}

func serialCheck(passengers int) {
	total := 0
	for i := 1; i <= passengers; i++ {
		total += airportCheck(i)
	}

	fmt.Println("serialCheck cost: ", total, " ms")
}

func airportCheck(id int) int {
	total := 0

	total += idCheck(id)
	total += bodyCheck(id)
	total += xRayCheck(id)
	fmt.Printf("goroutine %d airportCheck done\n", id)

	return total
}

func idCheck(id int) int {
	time.Sleep(time.Millisecond * time.Duration(timeCostIdCheck))
	// fmt.Printf("goroutine %d idCheck done\n", id)
	return timeCostIdCheck
}

func bodyCheck(id int) int {
	time.Sleep(time.Millisecond * time.Duration(timeCostBodyCheck))
	// fmt.Printf("goroutine %d bodyCheck done\n", id)
	return timeCostBodyCheck
}

func xRayCheck(id int) int {
	time.Sleep(time.Millisecond * time.Duration(timeCostXrayCheck))
	// fmt.Printf("goroutine %d xRayCheck done\n", id)
	return timeCostXrayCheck
}
