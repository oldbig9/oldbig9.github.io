package main

import (
	"time"
	"toolbox/ctxs"
)

func main() {
	ctxs.Foo()

	time.Sleep(time.Second * 3)
}
