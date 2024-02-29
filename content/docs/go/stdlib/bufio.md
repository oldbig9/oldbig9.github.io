---
weight: 999
title: "Bufio"
description: "Go标准库-bufio"
icon: "article"
date: "2023-10-17T18:49:07+08:00"
lastmod: "2023-10-17T18:49:07+08:00"
draft: true
tags:
 - Go
---

顾名思义就是带缓冲的io

## Variables

```go
const (
	// MaxScanTokenSize is the maximum size used to buffer a token
	// unless the user provides an explicit buffer with Scanner.Buffer.
	// The actual maximum token size may be smaller as the buffer
	// may need to include, for instance, a newline.
	MaxScanTokenSize = 64 * 1024
)

var (
	ErrInvalidUnreadByte = errors.New("bufio: invalid use of UnreadByte")
	ErrInvalidUnreadRune = errors.New("bufio: invalid use of UnreadRune")
	ErrBufferFull        = errors.New("bufio: buffer full")
	ErrNegativeCount     = errors.New("bufio: negative count")
)

var (
	ErrTooLong         = errors.New("bufio.Scanner: token too long")
	ErrNegativeAdvance = errors.New("bufio.Scanner: SplitFunc returns negative advance count")
	ErrAdvanceTooFar   = errors.New("bufio.Scanner: SplitFunc returns advance count beyond input")
	ErrBadReadCount    = errors.New("bufio.Scanner: Read returned impossible count")
)
```

## Types

### Reader

```go
type Reader struct {
	// contains filtered or unexported fields
}

func NewReader(rd io.Reader) *Reader

func NewReaderSize(rd io.Reader, size int) *Reader
```

Reader 默认buffer大小为4096
```go
package bufio

const (
	defaultBufSize = 4096
)
```

#### Read :star:

`func (b *Reader) Read(p []byte) (n int, err error)`

将内容读入p，注意p应该指定长度，返回读入的byte长度，可能小于len(p)

使用该方法应该每次都判断返回长度是否和len(p)相等

```go
package main

import (
	"bufio"
	"errors"
	"fmt"
	"io"
	"os"
)

func main() {
	filename := "main.go"
	ReadFile(filename)
}

func ReadFile(filepath string) {
	file, err := os.OpenFile(filepath, os.O_RDWR|os.O_CREATE, 0775)

	if err != nil {
		panic(err.Error())
	}

	defer file.Close()
	reader := bufio.NewReader(file)

	for {
		p := make([]byte, 10)
		n, err := reader.Read(p)
		if err != nil {
			if errors.Is(err, io.EOF) {
				break
			} else {
				fmt.Printf("Read failed, %v\n", err)
			}
		} else {
			fmt.Printf("Read %d bytes\n", n)
		}

		if n != len(p) {
			fmt.Println(p[:n])
		} else {
			fmt.Println(p)
		}
	}
}
```

#### ReadByte

`func (b *Reader) ReadByte() (byte, error)`

#### ReadBytes

`func (b *Reader) ReadBytes(delim byte) ([]byte, error)`

- 读取内容知道遇到delim字符，返回数据包含delim字符
- 当读取出现错误时(如io.EOF)，会返回发生错误之前读取的数据
- 只有内容不是以delim字符结尾的情况下才会返回错误

#### ReadLine

`func (b *Reader) ReadLine() (line []byte, isPrefix bool, err error)`

- 不建议使用，可以使用ReadeBytes('\n')、ReadString('\n')或Scanner替代
- 如果单行数据超过buffer的话，只返回改行buffer长度的内容，isPrefix=true，下次调用返回改行其他部分内容
- 返回结果不包含换行符

#### ReadRune

`func (b *Reader) ReadRune() (r rune, size int, err error)`

返回UTF-8编码的单个字符以及该字符的字节长度，如果字符非法，则读取单个byte并且返回unicode.ReplacementChar (U+FFFD)，size=1


### Scanner

```go
type Scanner struct {
	// contains filtered or unexported fields
}

func NewScanner(r io.Reader) *Scanner
```

#### 

### SplitFunc

```go
type SplitFunc func(data []byte, atEOF bool) (advance int, token []byte, err error)
func ScanBytes(data []byte, atEOF bool) (advance int, token []byte, err error)
func ScanLines(data []byte, atEOF bool) (advance int, token []byte, err error)
func ScanRunes(data []byte, atEOF bool) (advance int, token []byte, err error)
func ScanWords(data []byte, atEOF bool) (advance int, token []byte, err error)
```

```go
package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	filepath := "./main.go"
	ReadFile(filepath, bufio.ScanBytes)
}

func ReadFile(filepath string, splitFunc bufio.SplitFunc) {
	file, err := os.Open(filepath)

	if err != nil {
		panic(err.Error())
	}

	defer file.Close()

	reader := bufio.NewReader(file)
	scanner := bufio.NewScanner(reader)

	scanner.Split(splitFunc)

	for scanner.Scan() {
		fmt.Println(string(scanner.Bytes()))
	}
}

```