---
title: "Go语言编程中遇到的问题"
date: 2023-01-30 18:48:33
draft: false
tags:
- Go
categories:
- tech
---

## encoding/json

### 序列化转义HTML字符

json.Marshal()默认转义HTML字符("<", ">", "&", U+2028, and U+2029)，源码如下

```go
// Go版本 v1.18.9
// String values encode as JSON strings coerced to valid UTF-8,
// replacing invalid bytes with the Unicode replacement rune.
// So that the JSON will be safe to embed inside HTML <script> tags,
// the string is encoded using HTMLEscape,
// which replaces "<", ">", "&", U+2028, and U+2029 are escaped
// to "\u003c","\u003e", "\u0026", "\u2028", and "\u2029".
// This replacement can be disabled when using an Encoder,
// by calling SetEscapeHTML(false).
func Marshal(v any) ([]byte, error) {
	e := newEncodeState()

	err := e.marshal(v, encOpts{escapeHTML: true}) // 默认转义HTML字符
	if err != nil {
		return nil, err
	}
	buf := append([]byte(nil), e.Bytes()...)

	encodeStatePool.Put(e)

	return buf, nil
}
```

避免转义

```go
func MarshalUnescapeHtml(data interface{}) ([]byte, error) {
    bf := bytes.NewBuffer([]byte{})
    jsonEncoder := json.NewEncoder(bf)
    jsonEncoder.SetEscapeHTML(false) // 屏蔽HTML字符转义
    err := jsonEncoder.Encode(data)
    if err != nil {
        return nil, err
    }
    dataBytes := bf.Bytes()
    if len(dataBytes) > 1 && dataBytes[len(dataBytes)-1] == '\n' {
        dataBytes = dataBytes[0 : len(dataBytes)-1] // 去除jsonEncoder.Encode(m)添加的\n
    }
    
    return dataBytes, nil
}
```

至于Encode()时为什么拼接一个"\n"，源码中的注释字面意思看懂了，但不太理解，感觉完全可以由写代码的人自己决定拼接与否，而不是固化在Go源码中

```go
// Encode writes the JSON encoding of v to the stream,
// followed by a newline character.
//
// See the documentation for Marshal for details about the
// conversion of Go values to JSON.
func (enc *Encoder) Encode(v any) error {
	if enc.err != nil {
		return enc.err
	}
	e := newEncodeState()
	err := e.marshal(v, encOpts{escapeHTML: enc.escapeHTML})
	if err != nil {
		return err
	}

	// Terminate each value with a newline.
	// This makes the output look a little nicer
	// when debugging, and some kind of space
	// is required if the encoded value was a number,
	// so that the reader knows there aren't more
	// digits coming.
	e.WriteByte('\n') // 这里

	b := e.Bytes()
	if enc.indentPrefix != "" || enc.indentValue != "" {
		if enc.indentBuf == nil {
			enc.indentBuf = new(bytes.Buffer)
		}
		enc.indentBuf.Reset()
		err = Indent(enc.indentBuf, b, enc.indentPrefix, enc.indentValue)
		if err != nil {
			return err
		}
		b = enc.indentBuf.Bytes()
	}
	if _, err = enc.w.Write(b); err != nil {
		enc.err = err
	}
	encodeStatePool.Put(e)
	return err
}
```

### 反序列化科学计数法问题

反序列化时使用interface{}接收整数或者浮点数，直接打印时，整数部分超过6位时就会出现浮点数以科学计数法表示

```go
package main

import (
    "encoding/json"
    "fmt"
)

func main() {
    s := `{"num":1234567.2}`
    m := make(map[string]interface{})
    json.Unmarshal([]byte(s), &m)
    
    fmt.Println(m["num"]) // 1.2345672e+06
    fmt.Printf("%.2f", m["num"]) // 1234567.20
}
```

**解决方法**

- 尽量不要用interface{}接收反序列化的值
- `fmt.Sprintf("%.f", f)` 转字符串
- 使用第三包处理 `github.com/shopspring/decimal`


