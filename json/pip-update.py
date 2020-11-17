#! /usr/bin/env python2
#  -*- coding: utf-8 -*-
#  author:boo

import os
import re

os.system('pip3 list -o > 1.txt')

with open('1.txt','r') as pack:
    pa = pack.readlines()
    for i in pa:
        pkg = re.sub((r'(\s\d.*\d)|(--*-)|(wheel)|(sdist)|(Package)|(Version)|(Latest)|(Type)'),'',i.strip())
        os.system('pip3 install %s --upgrade'%pkg.strip())

os.system('pip3 list -o > 1.txt')
print('\nFaild update model is :')
with open('1.txt','r') as pack:
    pa = pack.readlines()
    for i in pa:
        print(i.strip())

os.system('rm 1.txt')
