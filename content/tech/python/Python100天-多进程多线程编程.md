---
title: "Python100天-多进程多线程编程"
date: 2023-03-02 09:37:42
draft: false
tags:
- Python
categories:
- tech
---

## 多进程示例

```python
from multiprocessing import Process
from os import getpid
from random import randint
from time import time, sleep


def download_task(filename):
    print('启动下载进程，进程号[%d].' % getpid())
    print('开始下载%s...' % filename)
    time_to_download = randint(5, 10)
    sleep(time_to_download)
    print('%s下载完成! 耗费了%d秒' % (filename, time_to_download))


def main():
    start = time()
    p1 = Process(target=download_task, args=('Python从入门到住院.pdf', ))
    p1.start()
    p2 = Process(target=download_task, args=('Peking Hot.avi', ))
    p2.start()
    p1.join()
    p2.join()
    end = time()
    print('总共耗费了%.2f秒.' % (end - start))


if __name__ == '__main__':
    main()
```

## 多线程示例

```python
from time import sleep
from threading import Thread, Lock

class Account(object):
    def __init__(self):
        self._balance = 0
        self._lock = Lock()


    def deposit(self, money):
        self._lock.acquire() # 加锁，防止多线程操作统一变量导致的问题
        try:
            new_balance = self._balance + money
            sleep(0.01) # 模拟交易耗时
            self._balance = new_balance
        finally:
            self._lock.release() # 释放锁

    @property
    def balance(self):
        return self._balance

    
class AddMoneyThread(Thread):
    def __init__(self, account, money):
        super().__init__()
        self._account = account
        self._money = money

    def run(self):
        self._account.deposit(self._money)

def main():
    account = Account()
    threads = []

    for _ in range(100):
        t = AddMoneyThread(account, 1)
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    print('账户余额:', account.balance)

if __name__ == '__main__':
    main()
```

