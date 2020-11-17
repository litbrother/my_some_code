#! /usr/bin/env python2
#  -*- coding: utf-8 -*-
#  author:boo

from threading import Thread
from time import sleep,ctime
from multiprocessing import Process
# class mythred(Thread):
#     def __init__(self,i):
#         super().__init__()
#         self.i = i
#         self.start()

#     def run(self):
#         sleep(8)
#         print(self.i, ctime())

def ruuu(i):
    while i < 6:
        print('in:', i, ctime())
        i += 1
def ruuuu(j):
    while j < 5:
        print('in:', j, ctime())
        j += 1

# if __name__ == "__main__":
j = 2
i = 3
mythred1 = Thread(target=ruuu, args=(i,))
mythred2 = Thread(target=ruuuu, args=(j,))

mythred1.start()
mythred2.start()


