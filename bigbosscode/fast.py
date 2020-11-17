#! python
# -*- coding: utf-8 -*-
# author:loo

import socket
import time
import sys

tricks = [
    "__import__('os').system('find ~')",
    "__import__('time').sleep(100)",
    r"print('\x1b\x5b\x33\x3b\x4a\x1b\x5b\x48\x1b\x5b\x32\x4a')",
    "exit()"
]


def removetricks(ss):
    for t in tricks:
        re = ss.replace(t,'None')
    return re


HOST = '202.38.95.47'  # 远程主机ip
PORT = 12009  # 远程主机端口

# 创建一个tcp套接字
s = socket.socket()

# 连接远程主机
s.connect((HOST, PORT))

data = s.recv(1024).decode(encoding = 'utf-8')

while True:
    data1 = s.recv(1024).decode(encoding = 'utf-8')
    print data1
    try:
        if "flag{" in data1:
            exit()
        num = str(eval(removetricks(data1))) + "\n"
        print num
        s.send(num.encode(encoding = "utf-8"))
    except Exception as e:
        pass
s.close()
