# -*- coding: utf-8 -*-
import scrapy


class WeiboSpider(scrapy.Spider):
    name = 'weibo'
    allowed_domains = ['https://s.weibo.com/top/summary']
    start_urls = ['https://s.weibo.com/top/summary/']

    def parse(self, response):
        pass
