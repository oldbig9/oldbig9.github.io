package main

import (
	"fmt"
	"io/ioutil"
)

func main() {
	content, err := ioutil.ReadFile("./channel.go")
	if err != nil {
		fmt.Printf("read file failed, %v\n", err)
	} else {
		fmt.Printf("file content: %s", string(content))
	}
}
