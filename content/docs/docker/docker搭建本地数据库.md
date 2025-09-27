---
weight: 100
title: "Docker搭建本地数据库"
description: ""
icon: "article"
date: "2025-09-27T20:54:48+08:00"
lastmod: "2025-09-27T20:54:48+08:00"
draft: true
toc: true
tags:
categories:
- tech
series:
---

本地想要搭建数据库环境，但又不想在笔记本上安装太多软件时，使用docker是一个非常好的选择

## 编写docker-compose.yml

```yml
version: '1.0'

services:
  redis:
    image: redis:latest
    container_name: redis-local
    ports:
      - "6379:6379"
    volumes:
      - ./redis/data:/data
      - ./redis/redis.conf:/usr/local/etc/redis/redis.conf
    command: ["redis-server", "/usr/local/etc/redis/redis.conf"]
    restart: always

  mysql:
    image: mysql:latest
    container_name: mysql-local
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: demodb
      MYSQL_USER: admin
      MYSQL_PASSWORD: admin
    ports:
      - "3306:3306"
    volumes:
      - ./mysql/data:/var/lib/mysql
      - ./mysql/my.cnf:/etc/mysql/my.cnf
    restart: always

  mongodb:
    image: mongo:latest
    container_name: mongodb-local
    ports:
      - "27017:27017"
    volumes:
      - ./mongodb/data:/data/db
      - ./mongodb/mongod.conf:/etc/mongo/mongod.conf
    command: ["mongod", "--config", "/etc/mongo/mongod.conf"]
    restart: always

  # elasticsearch:
  #   image: docker.elastic.co/elasticsearch/elasticsearch:8.13.4
  #   container_name: elasticsearch-local
  #   environment:
  #     - discovery.type=single-node
  #     - ES_JAVA_OPTS=-Xms512m -Xmx512m
  #     - xpack.security.enabled=false
  #   ports:
  #     - "9200:9200"
  #     - "9300:9300"
  #   volumes:
  #     - ./es/data:/usr/share/elasticsearch/data
  #     - ./es/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
  #   restart: always
  #   ulimits:
  #     memlock:π
  #       soft: -1
  #       hard: -1
  #   mem_limit: 1g
```

## 启动服务

```bash
docker-compose up -d
```