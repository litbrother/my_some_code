# -*- coding:utf8 -*-

from hackhttp import hackhttp
import base64
url = 'http://120.24.86.145:8002/web6/'
h = hackhttp(cookie_str='PHPSESSID=nsgvo07u0req808u0orteq1hvdsnttgf;')
code, head, html, redirect_url, log = h.http(url)
flag = base64.b64decode(base64.b64decode(head['flag']).split(': ')[1])
print (flag)
code, head, html, redirect_url, log = h.http(url,post='margin='+flag)
print (html)
