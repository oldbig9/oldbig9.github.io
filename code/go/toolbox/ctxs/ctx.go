package ctxs

import (
	"context"
	"fmt"
	"sync"
	"time"
)

func Foo() {
	ctx, cancel := context.WithTimeout(context.Background(), time.Millisecond*150)
	defer cancel()
	ch := make(chan struct{})
	var mu sync.Mutex

	x := make(map[string]string)

	s := time.Now().UnixMilli()
	go worker(ctx, ch, &mu, x, F1)
	go worker(ctx, ch, &mu, x, F2)
	go worker(ctx, ch, &mu, x, F3)

	select {
	case <-ctx.Done():
		fmt.Println("ctx done")
	case <-ch:
		fmt.Println("canceled.......")
		cancel()
	}

	for _, v := range x {
		fmt.Println(v)
	}

	t := time.Now().UnixMilli()
	fmt.Println("cost ", t-s)
}

func F1(ctx context.Context) string {
	time.Sleep(time.Millisecond * 100)
	fmt.Println("F1..................")
	return "F1 Done"
}

func F2(ctx context.Context) string {
	time.Sleep(time.Millisecond * 100)
	fmt.Println("F2..................")
	return "F2 Done"
}

func F3(ctx context.Context) string {
	time.Sleep(time.Millisecond * 300)
	fmt.Println("F3..................")
	fmt.Println(ctx.Deadline())
	return "F3 Done"
}

func worker(ctx context.Context, ch chan struct{}, mu *sync.Mutex, m map[string]string, f func(ctx context.Context) string) {
	select {
	case <-ctx.Done():
		fmt.Println("ctx canceled")
		return
	default:
		res := f(ctx)
		mu.Lock()
		m[res] = res
		if len(m) > 1 {
			ch <- struct{}{}
		}
		mu.Unlock()
	}
}
