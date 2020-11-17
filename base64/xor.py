# -*- coding: utf8 -*-

import base64
a='AAoHAR1WI1BRX1RQJ1AgJVdfI1VXJ1JTJ1BVXiIjVyRRIiMlJRs='

s=base64.b64decode(a)
t=''

for i in s:
	t+=chr(ord(i)^102);
print(t)


#a = 'AAoHAR1XICMnIlBfUlRXXyBXJFRSUCRRI1RSJyQkIlYgU1EjURs='

"""b = a.decode('base64')

for i in range(256):
    print i,'---',
    for k in b:
        print chr(ord(k)^i),
    print ''"""

#print b
