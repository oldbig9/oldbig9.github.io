---
title: "Protobuf语法"
date: 2023-02-13 21:30:07
draft: false
tags:
  - protobuf
categories:
  - tech
---

## 官方文档

[https://protobuf.dev/programming-guides/proto3/](https://protobuf.dev/programming-guides/proto3/)

## protobuf 基本类型

| protobuf 类型 | Go 类型 | Java 类型  | Python 类型                 | PHP 类型       | 描述                                          |
| ------------- | ------- | ---------- | --------------------------- | -------------- | --------------------------------------------- |
| double        | float64 | double     | float                       | float          |                                               |
| float         | float32 | float      | float                       | float          |                                               |
| int32         | int32   | int        | int                         | integer        |                                               |
| int64         | int64   | long       | int/long                    | integer/string |                                               |
| uint32        | uint32  | int        | int/long                    | integer        |                                               |
| uint64        | uint64  | long       | int/long                    | integer/string |                                               |
| sint32        | int32   | int        | int                         | integer        | 负数序列化效率更高                            |
| sint64        | int64   | long       | int/long                    | integer/string | 负数序列化效率更高                            |
| fixed32       | uint32  | int        | int/long                    | integer        | 固定 4 字节，大于 2^28 次方时效率比 uint32 高 |
| fixed64       | uint64  | long       | int/long                    | integer/string | 固定 8 字节，大于 2^56 次方时效率比 uint64 高 |
| sfixed32      | int32   | int        | int                         | integer        | 固定 4 字节                                   |
| sfixed64      | int64   | long       | int/long                    | integer/string | 固定 8 字节                                   |
| bool          | bool    | boolean    | bool                        | boolean        |                                               |
| string        | string  | String     | string                      | string         | 长度小于 2^32                                 |
| bytes         | []byte  | ByteString | str(Python2)/bytes(Python3) | string         | 长度小于 2^32                                 |

**enum 类型**

enum 类型必须有 0 值，且 0 值必须是第一个元素

原因如下

> 0 是数值类型的默认值
>
> proto2 语法将第一个元素作为默认值

```protobuf
enum Corpus {
  CORPUS_UNSPECIFIED = 0;
  CORPUS_UNIVERSAL = 1;
  CORPUS_WEB = 2;
  CORPUS_IMAGES = 3;
  CORPUS_LOCAL = 4;
  CORPUS_NEWS = 5;
  CORPUS_PRODUCTS = 6;
  CORPUS_VIDEO = 7;
}

message SearchRequest {
  string query = 1;
  int32 page_number = 2;
  int32 result_per_page = 3;
  Corpus corpus = 4;
}
```

**map 类型**

```protobuf
map<string, Project> projects = 3;
```

> map 类型不可以使用 repeated

另一种实现方式

```protobuf
message MapFieldEntry {
  key_type key = 1;
  value_type value = 2;
}

repeated MapFieldEntry map_field = N;
```

## 定义 message

```protobuf
syntax = "proto2";

message UserReq {
    required uint64 uuid = 1; // uuid
}

message UserResp {
    optional string name = 1; // 姓名
    optional uint32 age  = 2; // 年龄
}
```

```protobuf
syntax = "proto3";

package = "xxx";

go_package = "xxxx";

message UserReq {
    uint64 uuid = 1; // uuid
}

message UserResp {
    string name = 1; // 姓名
    uint32 age  = 2; // 年龄
}
```

## 定义 service

```protobuf
service FooService {
  rpc GetSomething(GetSomethingRequest) returns (GetSomethingResponse);
  rpc ListSomething(ListSomethingRequest) returns (ListSomethingResponse);
}
```

## 导入其他proto文件

```protobuf
import "myproject/path/other.proto"
```

## 生成各种语言 pb 文件

```bash
protoc --proto_path=IMPORT_PATH --cpp_out=DST_DIR --java_out=DST_DIR --python_out=DST_DIR --go_out=DST_DIR --ruby_out=DST_DIR --objc_out=DST_DIR --csharp_out=DST_DIR path/to/file.proto
```
