package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
)

func main() {
	fp, err := os.Open("channel.go")
	if err != nil {
		log.Fatal("open file failed, %v", err)
	}

	defer fp.Close()

	scanner := bufio.NewScanner(fp)

	for scanner.Scan() {
		fmt.Println(scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
}
