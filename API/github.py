# -*- coding: utf-8 -*-

import pygal
from pygal.style import LightColorizedStyle as LCS, LightenStyle as LS
import requests

url = 'https://api.github.com/search/repositories?q=language:python&sort=stars'
r = requests.get(url)
response_dict = r.json()
repo_dicts = response_dict['items']
print("status code:", r.status_code)
'''
response_dict = r.json()
repo_dicts = response_dict['items']
print response_dict.keys()

print 'total_count:', response_dict['total_count']
# print 'items',response_dict['items']
print 'items_count:', len(response_dict['items'])

repo_dict = response_dict['items'][0]
print 'items0_key_count:', len(repo_dict)
for key in sorted(repo_dict.keys()):
    print key
'''

names, stars = [], []
for repo_dict in repo_dicts:
    names.append(repo_dict['name'])
    names.append(repo_dict['stargazers_count'])


my_style = LS('#333366', base_style=LCS)
chart = pygal.Bar(style=my_style, x_label_rotation=45, show_legend=False)
chart.title = 'Most-starred python projects on GitHub'
chart.add('', stars)
chart.render_to_file('python_repos.svg')
