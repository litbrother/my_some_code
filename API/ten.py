# -*- coding: utf-8 -*-
import requests
from threading import Thread
import time

url = 'https://www.mari0er.club/'
exitFlag = 0

class myThread (Thread):   #继承父类threading.Thread
    def __init__(self,id, url):
        super().__init__()
        self.id = id
        self.url = url
        self.start()
    def run(self):#把要执行的代码写到run函数里面 线程在创建后会直接运行run函数
        i = 0
        while i<10000:
            r = requests.get(self.url)
            print ('this is thread %s'%self.id,self.url)
            i += 1
            # time.sleep(1)
# 创建新线程
star = time.time()
for i in range(0,10):
    myThread(i,url)

# # 开启线程
# thread1.start()
# thread2.start()
end = time.time()
print (star - end)

