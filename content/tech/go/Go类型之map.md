---
title: "Go类型之map"
date: 2023-02-02 09:29:55
draft: false
tags:
- Go
categories:
- tech
---

## 负载因子6.5


## map引用传递

map作为参数传递给函数时，是引用传递，引用传递类型还有slice和channel
函数对map的操作对原map变量是生效的

```go
package main

import (
	"fmt"
)

func main() {
	m := make(map[string]string)
	m["a"] = "a"
	m["b"] = "b"

	foo(m)

	fmt.Printf("%+v", m) // output: map[a:b]
}

func foo(m map[string]string) {
	m["a"] = "b"
	delete(m, "b")
}
```

## map[key]不可寻址

```go
package main

import "fmt"

type Student struct {
	Name string
}

var list map[string]Student

func main() {

	list = make(map[string]Student)

	student := Student{"wwf"}

	list["student"] = student
	list["student"].Name = "wff"

	fmt.Println(list["student"])
}

// Line 18: Char 23: cannot assign to struct field list["student"].Name in map (solution.go)
```


```go
package main

import "fmt"

type Student struct {
	Name string
}

var list []Student

func main() {

	list = make([]Student, 1)

	student := Student{"wwf"}

	list[0] = student
	list[0].Name = "wff"

	fmt.Println(list[0])
}
```

```go
package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	m := make(map[int]string)
	m2 := make(map[int]string)
	m[1] = "a"
	m[2] = "b"
	m2[2] = "c"
	m2[3] = "d"

	bs, _ := json.Marshal(m)
	fmt.Println(string(bs)) // {"1":"a","2":"b"}

	err := json.Unmarshal(bs, &m2)
	if err != nil {
		fmt.Println(err)
	}

	fmt.Printf("%+v\n", m2) // map[1:a 2:b 3:d]
}
```

