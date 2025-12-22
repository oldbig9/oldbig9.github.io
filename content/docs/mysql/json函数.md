---
weight: 100
title: "MySQL JSON函数"
description: ""
icon: "article"
date: "2025-12-22T22:27:07+08:00"
lastmod: "2025-12-22T22:27:07+08:00"
draft: false
toc: true
tags:
- MySQL
categories:
- tech
series:
---

[MySQL JSON函数参考](https://www.sjkjc.com/mysql-ref/json-functions/)

项目需求，需要提供以下查询场景

表结构定义
```sql
CREATE TABLE `ad_material` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `material_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '素材名称',
  `material_tag` json DEFAULT NULL COMMENT '素材标签', // ["A", "B"]
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

- 素材可以多个标签
- 后台查询条件为material_tag字段包含某些个标签的素材

查询方式
### JSON_OVERLAPS
MySQL版本8.0.17以上，查询json1字符串和json2字符串是否有任何一个相同的键值对或元素
```sql
mysql> select version();
+-----------+
| version() |
+-----------+
| 9.4.0     |
+-----------+

mysql> select * from ad_material;
+----+---------------+--------------+
| id | material_name | material_tag |
+----+---------------+--------------+
|  1 | material 1    | ["A", "B"]   |
|  2 | material 2    | ["B", "C"]   |
+----+---------------+--------------+

mysql> select * from ad_material where JSON_OVERLAPS(`material_tag`, '["A","D"]');
+----+---------------+--------------+
| id | material_name | material_tag |
+----+---------------+--------------+
|  1 | material 1    | ["A", "B"]   |
+----+---------------+--------------+

mysql> select * from ad_material where JSON_OVERLAPS(`material_tag`, '["B","D"]');
+----+---------------+--------------+
| id | material_name | material_tag |
+----+---------------+--------------+
|  1 | material 1    | ["A", "B"]   |
|  2 | material 2    | ["B", "C"]   |
+----+---------------+--------------+
```
### JSON_CONTAINS
查询条件为多个时需要使用OR进行组合
```sql
mysql> select * from ad_material where JSON_CONTAINS(`material_tag`, '"A"') OR JSON_CONTAINS(`material_tag`, '"C"');
+----+---------------+--------------+
| id | material_name | material_tag |
+----+---------------+--------------+
|  1 | material 1    | ["A", "B"]   |
|  2 | material 2    | ["B", "C"]   |
+----+---------------+--------------+
```
### FIND_IN_SET
适用于**逗号**拼接的字符串查询是否包含某个元素，查询条件为多个时需要使用OR进行组合，适合少量数据场景
```sql
mysql> select * from ad_material;
+----+---------------+--------------+-----------------+
| id | material_name | material_tag | material_tag_v2 |
+----+---------------+--------------+-----------------+
|  1 | material 1    | ["A", "B"]   | A,B             |
|  2 | material 2    | ["B", "C"]   | B,C             |
+----+---------------+--------------+-----------------+

mysql> select * from ad_material where FIND_IN_SET('A', `material_tag_v2`);
+----+---------------+--------------+-----------------+
| id | material_name | material_tag | material_tag_v2 |
+----+---------------+--------------+-----------------+
|  1 | material 1    | ["A", "B"]   | A,B             |
+----+---------------+--------------+-----------------+

mysql> select * from ad_material where FIND_IN_SET('B', `material_tag_v2`);
+----+---------------+--------------+-----------------+
| id | material_name | material_tag | material_tag_v2 |
+----+---------------+--------------+-----------------+
|  1 | material 1    | ["A", "B"]   | A,B             |
|  2 | material 2    | ["B", "C"]   | B,C             |
+----+---------------+--------------+-----------------+

mysql> select * from ad_material where FIND_IN_SET('A', `material_tag_v2`) OR FIND_IN_SET('C', `material_tag_v2`);
+----+---------------+--------------+-----------------+
| id | material_name | material_tag | material_tag_v2 |
+----+---------------+--------------+-----------------+
|  1 | material 1    | ["A", "B"]   | A,B             |
|  2 | material 2    | ["B", "C"]   | B,C             |
+----+---------------+--------------+-----------------+
```