#! /usr/bin/python
#  -*- coding: utf-8 -*-
#  author:boo

import requests
from fake_useragent import UserAgent
from lxml import etree
import redis
import MySQLdb

try:
    m = MySQLdb.connect('localhost', 'root', '', 'mysql', charset='utf8')
    print('mysql 连接成功')
except:
    print('mysql 连接失败')

ua = UserAgent()
url = "https://s.weibo.com/top/summary"
header = {
    'Host':'s.weibo.com',
    'User-Agent':ua.random
     }
r = requests.get(url=url, headers = header)
html = etree.HTML(r.text)

def main():
    for i in range(1,12):
        a = ''.join(html.xpath('//*[@id="pl_top_realtimehot"]/table/tbody/tr[%d]/td[2]/a/text()'%i))
        b = ''.join(html.xpath('//*[@id="pl_top_realtimehot"]/table/tbody/tr[%d]/td[2]/a/@href'%i))
        c = ''.join(html.xpath('//*[@id="pl_top_realtimehot"]/table/tbody/tr[%d]/td[2]/span/text()'%i))
        #print(i-1,a,'https://s.weibo.com'+b.replace('&Refer=top','&Refer=SWeibo_box'),c)
        try:
            rds(i-1, a, b, c)
        except:
            print('redis 连接失败')
            exit()

    print(r.lrange('rank',0,-1),r.lrange('content',0,-1),r.lrange('hot',0,-1))
def rds(n, x, y, z):

    r=redis.StrictRedis(host = 'localhost', port = 6379, decode_responses = True)
    r.rpush('rank', n)
    #r.ltrim('rank',0,1)
    r.rpush('content', x)
   # r.ltrim('content',0,1)
    r.rpush('link', y)
   # r.ltrim('link',0,1)
    r.rpush('hot', z)
   # r.ltrim('hot',0,1)

if __name__ == "__main__":
    main()


