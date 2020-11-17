#! /usr/bin/python
# -*- coding: utf-8 -*-
# author:loo
import libnum
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
    #print hex(p), hex(q)
    d = int('0x9AA40D34E566A0EE4D0EF0A40A076FE0B63653DEEFEE3D15470D50F1EB4EB3096F3CBD36A36082E6FEEAA86010A3D4C47CBEBA78874735A623B6864E6714C03AC2097F21CD6876BE31065FAA3E14194527E69CC37B6E535729FCFF8354D1BAFDA69845A0D9D3925019B0749B6B7B99D9D87E322E2F344B28130AF21BF7CE0C21',16)
    #p = int('0xf4c0644e26e642c6160942c9bb43d703ee6610b209300257a360a99cbe12ea4b2da1b5c5c62a885eb7412274dec71877041aff99a5b16093e107d5f60b24e5fbL',16)
    #q = int('0xd7cda4a9e4a1fc98418d41f1cc21c0a153fadc090809d87869a95b8da6406c56a8028f93e453ff716adea69656ca3ca64cb92473eeeac1fbbc6db8c4b174cd51L',16)
    n = int('0xCE522FBBA31B08CEA95A54D9AC09BEC855CC927955FE1E6197EFFD693AA8F667F67C074B0390C66A0B8C11ABD11849CC570255FF8F982B236E34031711930AD4398D4E68FD279D4D0C7C7AC813BF5FF09AC58DDD35AA25F8D6BACD0B1A62261A81E7FB3F32D3C5C30802FA1EF78B5897CE65CDCD7EC6948FD86DC5ACD392C36B',16)
    e = int('0x010001',16)
    c = libnum.n2s(pow(n, e, p*q))
    print libnum.n2s(pow(c, d, p*q))
if __name__ == '__main__':
    main()
# e=int('0x10001',16)

# c = int('0x126c24e146ae36d203bef21fcd88fdeefff50375434f64052c5473ed2d5d2e7ac376707d76601840c6aa9af27df6845733b9e53982a8f8119c455c9c3d5df1488721194a8392b8a97ce6e783e4ca3b715918041465bb2132a1d22f5ae29dd2526093aa505fcb689d8df5780fa1748ea4d632caed82ca923758eb60c3947d2261c17f3a19d276c2054b6bf87dcd0c46acf79bff2947e1294a6131a7d8c786bed4a1c0b92a4dd457e54df577fb625ee394ea92b992a2c22e3603bf4568b53cceb451e5daca52c4e7bea7f20dd9075ccfd0af97f931c0703ba8d1a7e00bb010437bb4397ae802750875ae19297a7d8e1a0a367a2d6d9dd03a47d404b36d7defe8469', 16)

# d = int('0x12314d6d6327261ee18a7c6ce8562c304c05069bc8c8e0b34e0023a3b48cf5849278d3493aa86004b02fa6336b098a3330180b9b9655cdf927896b22402a18fae186828efac14368e0a5af2c4d992cb956d52e7c9899d9b16a0a07318aa28c8202ebf74c50ccf49a6733327dde111393611f915f1e1b82933a2ba164aff93ef4ab2ab64aacc2b0447d437032858f089bcc0ddeebc45c45f8dc357209a423cd49055752bfae278c93134777d6e181be22d4619ef226abb6bfcc4adec696cac131f5bd10c574fa3f543dd7f78aee1d0665992f28cdbcf55a48b32beb7a1c0fa8a9fc38f0c5c271e21b83031653d96d25348f8237b28642ceb69f0b0374413308481', 16)

# N = int('0x1564aade6f1b9f169dcc94c9787411984cd3878bcd6236c5ce00b4aad6ca7cb0ca8a0334d9fe0726f8b057c4412cfbff75967a91a370a1c1bd185212d46b581676cf750c05bbd349d3586e78b33477a9254f6155576573911d2356931b98fe4fec387da3e9680053e95a4709934289dc0bc5cdc2aa97ce62a6ca6ba25fca6ae38c0b9b55c16be0982b596ef929b7c71da3783c1f20557e4803de7d2a91b5a6e85df64249f48b4cf32aec01c12d3e88e014579982ecd046042af370045f09678c9029f8fc38ebaea564c29115e19c7030f245ebb2130cbf9dc1c340e2cf17a625376ca52ad8163cfb2e33b6ecaf55353bc1ff19f8f4dc7551dc5ba36235af9758b', 16)

# print libnum.n2s(pow(c, d, N))


#N = int('0x1564aade6f1b9f169dcc94c9787411984cd3878bcd6236c5ce00b4aad6ca7cb0ca8a0334d9fe0726f8b057c4412cfbff75967a91a370a1c1bd185212d46b581676cf750c05bbd349d3586e78b33477a9254f6155576573911d2356931b98fe4fec387da3e9680053e95a4709934289dc0bc5cdc2aa97ce62a6ca6ba25fca6ae38c0b9b55c16be0982b596ef929b7c71da3783c1f20557e4803de7d2a91b5a6e85df64249f48b4cf32aec01c12d3e88e014579982ecd046042af370045f09678c9029f8fc38ebaea564c29115e19c7030f245ebb2130cbf9dc1c340e2cf17a625376ca52ad8163cfb2e33b6ecaf55353bc1ff19f8f4dc7551dc5ba36235af9758b', 16)
c = libnum.n2s(pow(n, e, p*q))
# print libnum.n2s(pow(c, d, p*q))