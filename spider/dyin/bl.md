#<font face="方正兰亭黑">我是黑体字</font>
##<font face="方正兰亭黑">我是黑体字</font>
```python
#-*- coding : utf-8 -*-
import json
import random
import time
start = time.time()
#data = [{'a':1, 'b':2}]
json = json.loads(open("name.json").read())

for i in json:
    #name =  random.randint(7) + i
    print '%s%s%s' % (i, "@", random.randint(100, 1000000))
end = time.time()
print start - end

```
###测试三级标题