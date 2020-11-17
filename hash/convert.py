#-*- conding:utf-8-*-
import string,hashlib
a = string.digits+string.lowercase+string.uppercase
for i in a:
    for j in a:
        for k in a:
            for m in a:
                s=hashlib.md5(i+j+k+m).hexdigest()[0:6]
                if s=="afbbd4":
                        print(i+j+k+m)
                        break
