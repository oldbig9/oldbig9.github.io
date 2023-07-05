---
title: "Viper配置包"
date: 2023-06-29 11:42:01
draft: false
tags:
- Go
categories:
- tech
---

## [viper](https://github.com/spf13/viper)

```bash
go get github.com/spf13/viper
```

## 封装加载配置方法

```go
package configs

import "github.com/spf13/viper"

func LoadConfig(filepath string, encoding string, config interface{}) error {
	vp := viper.New()
	vp.SetConfigFile(filepath)
	vp.SetConfigType(encoding)
	err := vp.ReadInConfig()
	if err != nil {
		return err
	}

	return vp.Unmarshal(config)
}

func ReadConfig(filepath string, encoding string) (*viper.Viper, error) {
	vp := viper.New()
	vp.SetConfigFile(filepath)
	vp.SetConfigType(encoding)
	err := vp.ReadInConfig()

	return vp, err
}
```

