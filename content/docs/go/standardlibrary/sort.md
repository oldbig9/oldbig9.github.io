---
weight: 999
title: "Sort"
description: "Go标准库-sort"
icon: "article"
date: "2023-10-17T13:48:20+08:00"
lastmod: "2023-10-17T13:48:20+08:00"
draft: false
toc: true
tag:
  - Go
---

## Functions

### Find()-查找元素

> 该方法基于二分查找，需要被查找对象是排好序的，被查找对象升序降序需要与 cmp 方法保持一致，
>
> 如查找升序[]int 切片 s 时，target 如果小于 s[i], cmp 应返回小于 0 的值，相等时返回 0，大于时返回大于 0 的值
>
> 返回的是第一个被符合条件的下标

`func Find(n int, cmp func(int) int) (i int, found bool)`

```go
package main

import (
	"fmt"
	"sort"
	"strings"
)

func main() {
	s := "abcdefg"
	target := "c"
	FindChar(s, target)

	s2 := []int{1, 2, 3, 4, 5}
	FindInIntSlice(s2, 3)

}

func FindChar(s, target string) {
	i, found := sort.Find(len(s), func(i int) int {
		return strings.Compare(target, string(s[i]))
	})

	if found {
		fmt.Printf("found %s in %s at %d\n", target, s, i)
	} else {
		fmt.Printf("not found %s in %s\n", target, s)
	}
}

func FindInIntSlice(s []int, target int) {
	i, found := sort.Find(len(s), func(i int) int {
		if target < s[i] {
			return -1
		} else if target == s[i] {
			return 0
		} else {
			return 1
		}
	})

	if found {
		fmt.Printf("found %d in %v at %d\n", target, s, i)
	} else {
		fmt.Printf("not found %d in %v\n", target, s)
	}
}
```

### Float64s()-升序排序

对 float64 切片进行升序排序

`func Float64s(x []float64)`

```go
package main

import (
    "fmt"
    "sort"
)

func main() {
    x := []float64{3, 2, 1}
    sort.Float64s(x)
    fmt.Println(x) // [1 2 3]
}
```

### Float64AreSorted()-是否为升序排序

`func Float64AreSorted(x []float64) bool`

### Ints-int 切片升序排序

`func Ints(x []int)`

### IntsAreSorted()-是否为升序排序

`func IntsAreSorted(x []int) bool`

### IsSorted()

`func IsSorted(data Interface) bool`

```go
package main

import (
	"fmt"
	"sort"
)

// Test须实现sort.Interface类型方法
type Test struct {
	Data []int
}

func (t Test) Len() int {
	return len(t.Data)
}

func (t Test) Less(i, j int) bool {
	return t.Data[i] < t.Data[j]
}

func (t Test) Swap(i, j int) {
	t.Data[i], t.Data[j] = t.Data[j], t.Data[i]
}

func main() {
	x := Test{Data: []int{1, 2, 3}}
	x2 := Test{Data: []int{3, 2, 1}}
	x3 := Test{Data: []int{1, 3, 2}}

	fmt.Println(sort.IsSorted(x))  // true
	fmt.Println(sort.IsSorted(x2)) // false
	fmt.Println(sort.IsSorted(x3)) // false
}
```

> _注意：大多数场景下，slices.IsSortedFunc()(Go1.21 新增 slices 包)方法比该方法更有效，运行更快_

### Search()-查询元素

> 该方法也是基于二分查找，需要被查找对象是排序的
>
> 返回最小的下标，未查找到则返回-1

`func Search(n int, f func(int) bool) int`

```go
package main

import (
    "fmt"
    "sort"
)

func main() {
    x := []int{1,2,3}
    target := 2
    index := sort.Search(len(x), func(i int) bool {
        return target <= x[i]
    })

    fmt.Println(index)
}
```

### SearchFloat64s()

> 被查找对象必须升序排序
>
> 若存在，则返回最小的下标
>
> 如果 x 不存在，则返回 x 可以插入的下标位置(有可能为 len(a))，不理解为什么这么做

`func SearchFloat64s(a []float64, x float64) int`

```go
package main

import (
    "fmt"
    "sort"
)

func main() {
    a := []float64{1.0, 2.0, 2.0, 3.0}
    x := 2.0

    i := sort.SearchFloat64s(a, x)
    fmt.Println(i) // 1

    x = 1.5
    i = sort.SearchFloat64s(a, x)
    fmt.Println(i) // 1, 未找到，可以插入下标1位置

    x = 4.0
    i = sort.SearchFloat64s(a, x)
    fmt.Println(i) // 4，未找到，可以插入下标4位置
}
```

### SearchInts()

使用方式同 SearchFloat64s()方法

`func SearchInts(a []int, x int) int`

### SearchStrings()

使用方式同 SearchFloat64s()方法

`func SearchStrings(a []string, x string) int`

### Slice()-切片自定义排序

> 该方法无法保证元素值相同时保持原来顺序，稳定排序可以使用 SliceStable()方法
>
> 通过修改 less 方法控制是升序排序还是降序排序

`func Slice(x any, less func(i, j int) bool)`

```go
package main

import (
    "fmt"
    "sort"
)

func main() {
    x := []int{1,3,2,5,4}
    sort.Slice(x, func(i, j int) bool{
        return x[i] < x[j]
    })

    fmt.Println(x)
}
```

### SliceIsSorted()

`SliceIsSorted(x any, less func(i, j int) bool) bool`

### SliceStable()-切片自定义排序:star:

`func SliceStable(x any, less func(i, j int) bool)`

```go
package main

import (
    "fmt"
    "sort"
)

func main() {
    x := []int{1,3,2,5,4}
    sort.Slice(x, func(i, j int) bool{
        return x[i] < x[j]
    })

    fmt.Println(x)
}
```

### Sort()

`func Sort(data Interface)`

```go
package main

import (
	"fmt"
	"sort"
)

// Test须实现sort.Interface类型方法
type Test []int

func (t Test) Len() int {
	return len(t)
}

func (t Test) Less(i, j int) bool {
	return t[i] < t[j]
}

func (t Test) Swap(i, j int) {
	t[i], t[j] = t[j], t[i]
}

func main() {
	x := Test{4, 2, 3}

	sort.Sort(x)
	fmt.Println(x)
}
```

> _还是 sort.Slice()方法更方便一些_

### Stable():star:

使用方式同 Sort 方法

`func Stable(data Interface)`

### Strings()

> string 切片升序排序，建议使用 slices.Sort()方法

`func Strings(x []string)`

### StringsAreSorted()

`func StringsAreSorted(x []string) bool`

## Types

### Interface

```go
type Interface interface {
	// Len is the number of elements in the collection.
	Len() int

	// Less reports whether the element with index i
	// must sort before the element with index j.
	//
	// If both Less(i, j) and Less(j, i) are false,
	// then the elements at index i and j are considered equal.
	// Sort may place equal elements in any order in the final result,
	// while Stable preserves the original input order of equal elements.
	//
	// Less must describe a transitive ordering:
	//  - if both Less(i, j) and Less(j, k) are true, then Less(i, k) must be true as well.
	//  - if both Less(i, j) and Less(j, k) are false, then Less(i, k) must be false as well.
	//
	// Note that floating-point comparison (the < operator on float32 or float64 values)
	// is not a transitive ordering when not-a-number (NaN) values are involved.
	// See Float64Slice.Less for a correct implementation for floating-point values.
	Less(i, j int) bool

	// Swap swaps the elements with indexes i and j.
	Swap(i, j int)
}
```
