#! /usr/bin/env python2
# -*- coding: utf-8 -*-
#将图片按像素转化为二进制串
import numpy as np
from PIL import Image

img = Image.open("o22ut.png")
img_array = np.array(img)
flag =""
for x in range(0,24):        #图片为240*240 每10*10个像素为一个二进制
    line =""
    for y in range(0,24):
        r = img_array[x*10 ,y*10][0]
        g = img_array[x*10 ,y*10][1]
        b = img_array[x*10 ,y*10][2]
        if r == 255 and b == 255:
            line +="1"
        if g == 255:
            line +="0"
        if len(line) == 8:
            flag +=chr(int(line, 2))
            line =""
print(flag)
