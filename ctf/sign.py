#! /usr/bin/env python2
#  -*- coding: utf-8 -*-
#  author:boo

'''
 一道签名破解题目
'''
import hashlib
str = "goods_enstr=eyJpZCI6IjQiLCJuYW1lIjoiXHU2MjExXHU3Njg0RmxhZyJ9totalprice=0.01ordertime=1562641317"
ss = sorted(str)  # 将字符串按 ascll 大小排序
print(hashlib.md5((''.join(ss)).encode()).hexdigest()) # 对排序后对字符串进行 md5
