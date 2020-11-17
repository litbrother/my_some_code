#! /usr/bin/env python3
#  -*- coding: utf-8 -*-
#  author:boo

# import json
import os,sys
import requests

url = 'http://gamehelper.gm825.com/wzry/hero/list?channel_id=90001a&app_id=h9044j&game_id=7622&game_name=%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80&vcode=13.0.2.1&version_code=13021&cuid=56B6141502D43E9471F42DEBF1BA6C3F&ovr=5.1.1&device=xiaomi_xiaomi+mix&net_type=1&client_id=05q%2BiueJFm%2BMilctxVubSw%3D%3D&info_ms=XPRbjXGXI0zeyBYoN6mEKA%3D%3D&info_ma=hUF5HQ%2FOCnJmUs3fZVpLHEr%2Bp3zDH5Tf10wG7bkgkiM%3D&mno=0&info_la=HA0pNbc8bcZjganuGGuSXg%3D%3D&info_ci=HA0pNbc8bcZjganuGGuSXg%3D%3D&mcc=0&clientversion=13.0.2.1&bssid=qZ67E3jBR3tsrktVHQE52s9xKiTx%2Bfllic8tby1rm2c%3D&os_level=22&os_id=7bc174197f1a0fef&resolution=1080_1920&dpi=480&client_ip=172.16.2.15&pdunid=0097a576'
r = requests.get(url).json()
a = 0
h_path = 'h_path'
for new_hero in (r['list']):
    if int(new_hero['hero_id']) > a:
        a = int(new_hero['hero_id'])
        b = new_hero['name']

with open('h.txt','w+') as hr:
        print('王者荣耀目前一共有%d位英雄'%len(r['list']), file=hr)
        print('最新英雄是:%s'%b, file=hr)

with open('h.txt','r+') as h:
        for line in h:
                print(line,end='')              
