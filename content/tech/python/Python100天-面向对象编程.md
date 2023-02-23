---
title: "Python100天-面向对象编程"
date: 2023-02-23 10:51:13
draft: false
tags:
- Python
categories:
- tech
---

## 面向对象

> 把一组数据结构和处理它们的方法组成对象（object），把相同行为的对象归纳为类（class），
> 通过类的封装（encapsulation）隐藏内部细节，
> 通过继承（inheritance）实现类的特化（specialization）和泛化（generalization），
> 通过多态（polymorphism）实现基于对象类型的动态分派。


### 类

```python
class Student(object):
    # __init__方法用于创建对象时进行初始化操作
    def __init__(self, name, age):
        self.name = name
        self.age = age

    # PEP8要求标识符的名字用全小写+下划线连接形式
    def study_course(self, course_name):
        print(f'{self.name}正在学习{course_name}')

def main():
    stu = Student('wang', 18)
    stu.study_course('Python 100天')

if __name__ == '__main__':
    main()
```

### 属性访问可见性问题

Python中属性和方法的访问权限只有两种，也就是公开的和私有的，私有的即以__(双下划线)开头命名

但私有属性也不是绝对不可以访问，开发中不建议将属性设置为私有的

可以以_(单下划线)开头表示属性是私有的，其他代码访问该属性时要保持慎重

```python
class Test:

    def __init__(self, foo):
        self.__foo = foo

    def __bar(self):
        print(self.__foo)
        print('__bar')


def main():
    test = Test('hello')
    # AttributeError: 'Test' object has no attribute '__bar'
    # test.__bar()
    # AttributeError: 'Test' object has no attribute '__foo'
    # print(test.__foo)

    test._Test__bar()
    print(test._Test__foo)

if __name__ == "__main__":
    main()
```

### 装饰器

```python
class Person(object):
    def __init__(self, name, age):
        self._name = name
        self._age = age

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, name):
        self._name = name

    @property
    def age(self):
        return self._age

    @age.setter
    def age.(self, age)
        self._age = age

def main():
    p = Person('wang', 18)
    print(p.name)
    p.name = 'wan'
    print(p.name)

if __name__ == '__main__':
    main()
```

### __slots__

__slots__限定类的对象只能绑定某些属性
只对当前类生效，对子类不生效

```python
class Person(object):
    # 限定Person对象只能绑定_name, _age属性
    __slots__ = ('_name', '_age')

    def __init__(self, name, age):
        self._name = name
        self._age = age

def main():
    p = Person('wang', 18)
    p.birthday = '2023-02-23' # AttributeError: 'Person' object has no attribute 'birthday'


if __name__ == '__main__':
    main()
```

### 静态方法(@staticmethod)

```python
from math import sqrt

class Triangle(object):
    def __init__(self, a, b, c):
        self._a = a
        self._b = b
        self._c = c

    @staticmethod
    def is_valid(a, b, c):
        return a + b > c and a + c > b and b + c > a

    def perimeter(self):
        return self._a + self._b + self._c

    def area(self):
        half = self.perimeter() / 2
        return sqrt(half * (half - self._a) * (half - self._b) * (half - self._c))

def main():
    a, b, c = 2, 3, 4

    if Triangle.is_valid(a, b, c):
        t = Triangle(a, b, c)
        print('可以构建三角形')
        print('周长:', t.perimeter())
        print('面积:', Triangle.area(t))
    else:
        print('无法构建三角形')

if __name__ == '__main__':
    main()
```

### 类方法(@classmethod)

```python
from time import time, localtime, sleep

class Clock(object):
    def __init__(self, hour=0, minute=0, second=0):
        self._hour = hour
        self._minute = minute
        self._second = second

    @classmethod
    def now(cls):
        ctime = localtime(time())
        return cls(ctime.tm_hour, ctime.tm_min, ctime.tm_sec)

    def show(self):
        return '%02d:%02d:%02d' % (self._hour, self._minute, self._second)

def main():
    clock = Clock.now()
    print(clock.show())

if __name__ == '__main__':
    main()
```

### 类之间的关系

类和类之间的关系有三种：is-a、has-a和use-a关系

- is-a关系也叫继承或泛化，比如学生和人的关系、手机和电子产品的关系都属于继承关系。
- has-a关系通常称之为关联，比如部门和员工的关系，汽车和引擎的关系都属于关联关系；关联关系如果是整体和部分的关联，那么我们称之为聚合关系；如果整体进一步负责了部分的生命周期（整体和部分是不可分割的，同时同在也同时消亡），那么这种就是最强的关联关系，我们称之为合成关系。
- use-a关系通常称之为依赖，比如司机有一个驾驶的行为（方法），其中（的参数）使用到了汽车，那么司机和汽车的关系就是依赖关系。

### 继承和多态

子类继承父类方法，也可以重写父类方法(多态)

```python
class Person(object):
    def __init__(self, name, age)
        self._name = name
        self._age = age

    def i_am(self):
        print(self._name)

class Student(Person):
    def __init__(self, name, age, grade):
        super().__init__(name, age)
        self._grade = grade

    def i_am(self):
        print(self._grade, '年纪的', self._name)

class Student(Person):
    def __init__(self, name, age):
        super().__init__(name, age)

    def i_am(self):
        print('老师', self._name)
```