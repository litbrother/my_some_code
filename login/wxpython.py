#! /usr/bin/env python
# -*- coding: utf-8 -*-
# author:boo

import wx, os, time
from splinter import Browser
from threading import Thread
import requests
from bs4 import BeautifulSoup

class scan(Thread):
    def __init__(self,s,e):
        super().__init__()
        # Thread.__init__(self)
        self.s = s
        self.e = e
        #线程实例化时立即启动
        self.start()

    def run(self):

        # 设备信息
        #value = "{}".format(self.product.GetSelection())

        # url
        url = self.s.input_url.GetValue()

        # 浏览器状态信息
        browser_status = "{}".format(self.s.browser_bar.GetSelection())

        if self.s.user_name.Value == '':
            wx.MessageBox("请选择用户名字典")
        elif self.s.user_pwd.Value == '':
            wx.MessageBox("请选择密码字典")

        # elif value == '-1':
        #     wx.MessageBox("请选择设备！")

        elif browser_status =='-1':
            wx.MessageBox("请选择是否显示浏览器！")
        elif url == '':
            wx.MessageBox("请输入正确的地址！")

        else:

            # TestThread()

            self.s.button_start.SetLabel("正在扫描")
            self.s.button_start.Enable(False)
            self.s.button_open_user.Enable(False)
            self.s.button_open_pw.Enable(False)
            self.s.button_stop.Enable()
            self.s.input_url.Enable(False)
            self.s.user_name.Enable(False)
            self.s.user_pwd.Enable(False)
            self.s.browser_bar.Enable(False)
            #self.product.Enable(False)
            # event.GetEventObject().Enable(False)

            #测试代码
            #wx.MessageBox("OOOOOOOK！！！！")
            #time.sleep(2)

            # 浏览器路径配置
            executable_path = {'executable_path': r'chromedriver'}

            # 浏览器状态
            if browser_status == '0': # 显示
                self.s.browser = Browser('chrome', **executable_path)
            if browser_status == '1': # 隐藏
                self.s.browser = Browser('chrome', headless = True, **executable_path)

            self.s.status.Value = '正在检查网页适配情况...'

            try:
                r = requests.get(url)
                r.encoding = 'utf-8'
                soup = BeautifulSoup(r.text,'html.parser')
                #print('1')

                #查找用户名标签
                try:
                    try:
                        self.s.u_name = soup.find(type = "text")["name"]
                    except:
                        self.s.u_name = soup.find(type = "text")["id"]
                except:

                    try:
                        self.s.u_name = soup.find(type = "email")["name"]
                    except:
                        self.s.status.AppendText("\n网页信息获取失败")
                        self.recover()
                        return()

                #查找密码标签
                try:
                    self.s.u_pwd = soup.find(type = "password")["name"]
                except:
                    try:
                        self.s.u_pwd = soup.find(type = "password")["id"]
                    except:
                        self.s.status.AppendText("\n网页信息获取失败")

                        self.recover()
                        return()

                #查找登陆标签
                try:
                    try:
                        self.s.u_submit = soup.find(type = "button")["name"]
                    except:
                        self.s.u_submit = soup.find(type = "button")["id"]
                except:

                    try:
                        self.s.u_submit = soup.find(type = "submit")["name"]
                    except:
                        self.s.status.AppendText("\n网页信息获取失败")
                        self.recover()
                        return()

                self.s.status.AppendText("\n网页信息获取成功，即将开始扫描……")

            except:

                self.s.status.AppendText("\n网页信息获取失败")
                self.recover()
                return()


            # 访问链接
            self.s.browser.visit(url)

            # 打开字典
            with open(self.s.user_pwd.Value) as pass_wd:
                #pw = json.load(pwd)
                pw = pass_wd.readlines()
            with open(self.s.user_name.Value) as us:
                #users = json.load(us)
                users = us.readlines()

            try:
                for user in users:
                    user = user.strip("\n")
                    for pwd in pw:
                        pwd = pwd.strip("\n")
                        self.s.browser.find_by_name(self.s.u_name).fill(user)
                        self.s.browser.find_by_name(self.s.u_pwd).fill(pwd)
                        self.s.browser.find_by_name(self.s.u_submit).click()
                        if self.s.browser.is_element_not_present_by_name(self.s.u_name):

                            self.s.status.AppendText("\n可能存在弱口令如下：")
                            self.s.status.AppendText('\nusername:%s'% user)
                            self.s.status.AppendText('\npassword:%s'% pwd)
                            self.s.browser.visit(url +'/login.php')
                            continue

                self.recover()

            except:

                self.recover()

    def recover(self):
        self.s.status.AppendText('\n扫描结束')
        self.s.browser.quit()
        self.s.button_stop.Enable(False)
        self.s.button_open_pw.Enable()
        self.s.button_open_user.Enable()
        self.s.input_url.Enable()
        self.s.user_name.Enable()
        self.s.user_pwd.Enable()
        self.s.browser_bar.Enable()
        #self.product.Enable()
        self.s.button_start.SetLabel("开始扫描")
        self.s.button_start.Enable()

class MyFrame(wx.Frame):
    def __init__(self, parent, title):
        wx.Frame.__init__(self, parent, title = title, size = (570, 450))

        self.Center() # 设置窗口居中
        self.makemenubar() # 主函数

        # 状态栏
        self.CreateStatusBar()
        self.SetStatusText("欢迎使用安科弱口令检测工具")

        # 展示图标
        self.icon = wx.Icon(name = "icon1.png", type = wx.BITMAP_TYPE_PNG)
        self.SetIcon(self.icon)

    def makemenubar(self):

        # 创建面板
        panel = wx.Panel(self)

        # 选择用户名字典文件
        statictext = wx.StaticText(panel,label = '请选择用户名字典文件：', pos = (20, 25))
        font = statictext.GetFont()
        #font.PointSize += 2
        font = font.Bold()
        statictext.SetFont(font)
        self.user_name = wx.TextCtrl(panel, -1, size = (175, -1), pos = (175, 20))
        self.user_name.SetInsertionPoint(0)

        # 选择密码字典文件
        statictext = wx.StaticText(panel,label = '请选择密码字典文件：', pos = (20, 65))
        font = statictext.GetFont()
        #font.PointSize += 2
        font = font.Bold()
        statictext.SetFont(font)
        self.user_pwd = wx.TextCtrl(panel, -1, size = (175, -1), pos = (175, 60))
        self.user_pwd.SetInsertionPoint(0)

        # 是否显示浏览器
        statictext = wx.StaticText(panel, label = '是否显示浏览器：', pos = (20, 105))
        font = statictext.GetFont()
        #font.PointSize += 2
        font = font.Bold()
        statictext.SetFont(font)
        list0 = ['是','否']
        self.browser_bar = wx.Choice(panel, choices = list0, pos = (175, 100))
        self.Bind(wx.EVT_CHOICE, self.on_browser, self.browser_bar)

        # 设备下拉框
        # statictext = wx.StaticText(panel,label='请选择要进行扫描的设备：', pos=(20,105))
        # font = statictext.GetFont()
        # #font.PointSize += 2
        # font = font.Bold()
        # statictext.SetFont(font)

        # '''设备列表，如果需要请自行添加 值从0开始'''
        # list1 = ['LogBase','绿盟IPS','绿盟防火墙','天融信防火墙']

        # """下拉选项"""
        # self.product = wx.Choice(panel, choices=list1, pos=(175,100))
        # self.Bind(wx.EVT_CHOICE, self.on_combobox, self.product)

        # web登陆页面url
        statictext = wx.StaticText(panel, label = '请输入设备登陆界面URL：', pos = (20, 145))
        font = statictext.GetFont()
        #font.PointSize += 2
        font = font.Bold()
        statictext.SetFont(font)


        # url输入
        self.input_url = wx.TextCtrl(panel, -1, size = (175, -1), pos = (175, 140))
        self.input_url.SetInsertionPoint(0)
        self.Bind(wx.EVT_TEXT, self.url, self.input_url)

        # 创建 button
        self.button_start = wx.Button(panel, 1, "开始扫描", pos = (355, 137))
        self.button_start.Bind(wx.EVT_BUTTON, self.OnClick)
        #self.button.SetDefault()

        self.button_stop = wx.Button(panel, 1, "停止扫描", pos = (450, 137))
        self.button_stop.Bind(wx.EVT_BUTTON, self.Stop)
        self.button_stop.Enable(False)

        self.button_open_user = wx.Button(panel, 1, "打开", pos = (355, 17))
        self.button_open_user.Bind(wx.EVT_BUTTON, self.open_user)

        self.button_open_pw = wx.Button(panel, 1, "打开", pos = (355, 57))
        self.button_open_pw.Bind(wx.EVT_BUTTON, self.open_pwd)

        # 扫描状态
        statictext = wx.StaticText(panel, label='扫描状态：', pos = (20,180))
        font = statictext.GetFont()
        #font.PointSize += 2
        font = font.Bold()
        statictext.SetFont(font)
        self.status = wx.TextCtrl(panel, -1, size = (450, 130), pos = (30,205), style = wx.TE_MULTILINE)
        #self.status.SetInsertionPoint(0)

        # 创建选项卡
        helpbar = wx.Menu()
        about = helpbar.Append(wx.ID_ABOUT, "关于")
        readme = helpbar.Append(wx.ID_ANY, "使用说明")
        self.Bind(wx.EVT_MENU, self.about, about)
        self.Bind(wx.EVT_MENU, self.readme, readme)

        # filebar = wx.Menu()
        # self.user = filebar.Append(wx.ID_OPEN, "选择用户名文件")
        # self.pwd = filebar.Append(wx.ID_ANY, "选择密码文件")
        # self.Bind(wx.EVT_MENU, self.open_user, self.user)
        # self.Bind(wx.EVT_MENU, self.open_pwd, self.pwd)

        # 创建菜单栏
        menuBar = wx.MenuBar()

        # 将选项卡添加到帮助目录下
        menuBar.Append(helpbar, "&帮助")
        # menuBar.Append(filebar, "&打开")
        self.SetMenuBar(menuBar)

    def on_browser(self, event):
        pass

    def on_combobox(self, event):
        pass

    def url(self, event):
        pass

    def open_user(self, event):
        filesFilter = "Dicom (*.txt)|*.txt|" "All files (*.*)|*.*"
        fileDialog = wx.FileDialog(self, message = "选择账户字典", wildcard = filesFilter, style = wx.FD_OPEN)
        dialogResult = fileDialog.ShowModal()
        if dialogResult !=  wx.ID_OK:
            return()
        path = fileDialog.GetPath()
        self.user_name.Value = path
        #wx.MessageBox(path)
        #self.__TextBox.SetLabel(path)

    def open_pwd(self, event):
        filesFilter = "Dicom (*.txt)|*.txt|" "All files (*.*)|*.*"
        fileDialog = wx.FileDialog(self, message = "选择密码字典", wildcard = filesFilter, style = wx.FD_OPEN)
        dialogResult = fileDialog.ShowModal()
        if dialogResult !=  wx.ID_OK:
            return()
        path1 = fileDialog.GetPath()
        self.user_pwd.Value = path1
        #wx.MessageBox(path)
        #self.__TextBox.SetLabel(path)

    def readme(self, event):
        """使用说明"""
        wx.MessageBox("此程序还处于开发阶段\n可能会出现程序无响应的状态此为正常请稍等片刻")

    def about(self, event):
        """公司信息"""
        wx.MessageBox("power by Ankenet\n浙江安科网络技术有限公司\n联系电话：0571-88219027\n邮件：service@ankenet.com\n地址：杭州市教工路6号求是大厦16楼")

    def Stop(self, event):

        #wx.MessageBox("....")
        self.button_stop.SetLabel("正在停止")
        self.browser.quit()
        self.button_stop.Enable(False)
        self.input_url.Enable()
        self.user_name.Enable()
        self.user_pwd.Enable()
        self.browser_bar.Enable()
        #self.product.Enable()
        self.button_start.SetLabel("开始扫描")
        self.button_start.Enable()
        self.button_stop.SetLabel("停止扫描")

    def OnClick(self, event):
        scan(self,event)

if __name__ == "__main__":
    app = wx.App()
    frame = MyFrame(None, '安科弱口令检测')
    frame.Show()
    app.MainLoop()
