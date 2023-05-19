package main

import "fmt"

func main() {
	deadlock1()
}

func deadlock1() { //无缓冲channel只写不读
	ch := make(chan int)
	/*
		go func() {
			a := <-ch
			fmt.Println(a)
		}()
	*/
	ch <- 3 //  这里会发生一直阻塞的情况，执行不到下面一句
	fmt.Println("next")
}
