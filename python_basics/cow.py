#-*- coding : utf-8 -*-

'''
有一头母牛，他每年年初生一头小母牛，眉头小母牛从第四个年头开始，每年年初也生一头小母牛。求第n年
'''

year = int(input("please input year num："))

def num_of_cow(n):
    if n==1:
        return 2
    if n==2:
        return 3
    if n==3:
        return 4
    if n==4:
        return 6
    return num_of_cow(n - 3) + num_of_cow(n - 1)

print ("一共有%d头牛" % num_of_cow(year))
