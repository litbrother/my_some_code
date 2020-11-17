#! /usr/bin/python
# -*- coding: utf-8 -*-
# author:loo
from socket import *

tcpClient = socket(AF_INET, SOCK_STREAM)
tcpClient.connect(("202.38.95.47", 12009))

while True:
    data = tcpClient.recv(1024).decode(encoding="utf-8")
    print(data)
    try:
        if "flag{" in data:
            exit()
        result = eval(data.replace("exit()", "0").replace(
            "sleep(100)", "sleep(0)"))
        rtn = str(result) + "\n"
        print(rtn)
        tcpClient.send(rtn.encode(encoding="utf-8"))

    except Exception as e:
        pass
tcpClient.close()
