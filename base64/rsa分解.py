import random

def gcd(a, b):
    if a < b:
        a, b = b, a
    while b != 0:
        temp = a % b
        a = b
        b = temp
    return a


def getpq(n, e, d):
    p = 1
    q = 1
    while p == 1 and q == 1:
        k = d * e - 1
        g = random.randint(0, n)
        while p == 1 and q == 1 and k % 2 == 0:
            k /= 2
            y = pow(g, k, n)
            if y != 1 and gcd(y - 1, n) > 1:
                p = gcd(y - 1, n)
                q = n / p
    return p, q


def main():
    n=0xCE522FBBA31B08CEA95A54D9AC09BEC855CC927955FE1E6197EFFD693AA8F667F67C074B0390C66A0B8C11ABD11849CC570255FF8F982B236E34031711930AD4398D4E68FD279D4D0C7C7AC813BF5FF09AC58DDD35AA25F8D6BACD0B1A62261A81E7FB3F32D3C5C30802FA1EF78B5897CE65CDCD7EC6948FD86DC5ACD392C36B
    e=0x010001
    d=0x9AA40D34E566A0EE4D0EF0A40A076FE0B63653DEEFEE3D15470D50F1EB4EB3096F3CBD36A36082E6FEEAA86010A3D4C47CBEBA78874735A623B6864E6714C03AC2097F21CD6876BE31065FAA3E14194527E69CC37B6E535729FCFF8354D1BAFDA69845A0D9D3925019B0749B6B7B99D9D87E322E2F344B28130AF21BF7CE0C21
    p, q = getpq(n, e, d)
    print hex(p), hex(q)

if __name__ == '__main__':
    main()
