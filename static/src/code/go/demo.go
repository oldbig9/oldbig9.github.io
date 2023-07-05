package main

import (
	"fmt"
	"unsafe"
)

func main() {
	s := make([]Foo, 0, 1000)

	for i := 0; i < cap(s); i++ {
		s = append(s, Foo{
			Name: "",
		})
	}

	fmt.Println(unsafe.Sizeof(s))
}

type Foo struct {
	Name string
}
