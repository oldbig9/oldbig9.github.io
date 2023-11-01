package main

import (
	"fmt"
	"os"
)

func main() {
	content, err := os.ReadFile("./channel.go")
	if err != nil {
		fmt.Printf("read file failed, %v\n", err)
	} else {
		fmt.Printf("file content: %s", string(content))
	}
}
