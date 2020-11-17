#! /usr/bin/env python
# -*- coding: utf-8 -*-
# author:boo

import wx, os, time
from splinter import Browser
from threading import Thread 
#from wx.lib.pubsub import pub
import requests
from bs4 import BeautifulSoup
import json

class TestThread(Thread):
    def __init__(self):
        #线程实例化时立即启动
        Thread.__init__(self)
        self.start()
        
    def run(self):
        #线程执行的代码
        for i in range(101):
            time.sleep(0.03)
            wx.CallAfter(pub.sendMessage, "update", msg=i)
            time.sleep(0.5)
    #     pub.subscribe(self.test, "power")
        
    # def test(self,name,pwd):    
    #     n = name
    #     wx.MessageBox(n)

class MyFrame(wx.Frame):
    def __init__(self, parent, title):
        wx.Frame.__init__(self, parent, title=title, size=(570,450))

        self.Center() # 设置窗口居中
        self.makemenubar() # 主函数

        # 状态栏
        self.CreateStatusBar()
        self.SetStatusText("欢迎使用安科弱口令检测工具")
        
        # 展示图标
        self.icon = wx.Icon(name="icon1.png",  type=wx.BITMAP_TYPE_PNG)
        self.SetIcon(self.icon)

        #pub.subscribe(self.updateDisplay, "update")

    def makemenubar(self):

        # 创建面板
        panel = wx.Panel(self)

        # 选择用户名字典文件
        statictext = wx.StaticText(panel,label='请选择用户名字典文件：', pos=(20,25))
        font = statictext.GetFont()
        #font.PointSize += 2
        font = font.Bold()
        statictext.SetFont(font)
        self.user_name = wx.TextCtrl(panel, -1, size=(175, -1), pos=(175,20))
        self.user_name.SetInsertionPoint(0)
        
        # 选择密码字典文件
        statictext = wx.StaticText(panel,label='请选择密码字典文件：', pos=(20,65))
        font = statictext.GetFont()
        #font.PointSize += 2
        font = font.Bold()
        statictext.SetFont(font)
        self.user_pwd = wx.TextCtrl(panel, -1, size=(175, -1), pos=(175,60))
        self.user_pwd.SetInsertionPoint(0)

        # 是否显示浏览器
        statictext = wx.StaticText(panel,label='是否显示浏览器：', pos=(20,105))
        font = statictext.GetFont()
        #font.PointSize += 2
        font = font.Bold()
        statictext.SetFont(font)
        list0 = ['是','否']
        self.browser_bar = wx.Choice(panel, choices=list0, pos=(175,100))
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
        statictext = wx.StaticText(panel,label='请输入设备登陆界面URL：', pos=(20,145))
        font = statictext.GetFont()
        #font.PointSize += 2
        font = font.Bold()
        statictext.SetFont(font)


        """url输入"""
        self.input_url = wx.TextCtrl(panel, -1, size=(175, -1), pos=(175,140))
        self.input_url.SetInsertionPoint(0)
        self.Bind(wx.EVT_TEXT, self.url, self.input_url)

        # 创建 button
        self.button_start = wx.Button(panel, 1, "开始扫描", pos=(355,137))  
        self.button_start.Bind(wx.EVT_BUTTON, self.OnClick)  
        #self.button.SetDefault()

        self.button_stop = wx.Button(panel, 1, "停止扫描", pos=(450,137))  
        self.button_stop.Bind(wx.EVT_BUTTON, self.Stop)  
        self.button_stop.Enable(False)


        #线程（测试代码）
        # self.threading = wx.Button(panel, 1, "threading", pos=(355,17))  
        # #self.threading.Bind(wx.EVT_BUTTON, self.updateDisplay)  
        # self.threading.Enable(False)

    
        # 扫描状态
        statictext = wx.StaticText(panel, label='扫描状态：', pos=(20,180))
        font = statictext.GetFont()
        #font.PointSize += 2
        font = font.Bold()
        statictext.SetFont(font)
        self.status = wx.TextCtrl(panel, -1, size=(450, 130), pos=(30,205), style=wx.TE_MULTILINE)
        #self.status.SetInsertionPoint(0)

        # 创建选项卡
        helpbar = wx.Menu()
        about = helpbar.Append(wx.ID_ABOUT, "关于")
        readme = helpbar.Append(wx.ID_ANY, "使用说明")
        #pen_pwd = helpbar.Append(wx.ID_OPEN, "打开文件")
        self.Bind(wx.EVT_MENU, self.about, about)
        self.Bind(wx.EVT_MENU, self.readme, readme)
        #self.Bind(wx.EVT_MENU, self.open_pwd, open_pwd)
        
        filebar = wx.Menu()
        self.user = filebar.Append(wx.ID_OPEN, "选择用户名文件")
        self.pwd = filebar.Append(wx.ID_ANY, "选择密码文件")
        self.Bind(wx.EVT_MENU, self.open_user, self.user)
        self.Bind(wx.EVT_MENU, self.open_pwd, self.pwd)

        # 创建菜单栏
        menuBar = wx.MenuBar()

        # 将选项卡添加到帮助目录下
        menuBar.Append(helpbar, "&帮助")
        menuBar.Append(filebar, "&打开") 
        self.SetMenuBar(menuBar)


    def on_browser(self, event):
        pass

    def on_combobox(self, event):
        pass

    def url(self, event):
        pass
 
    def open_user(self, event):
        filesFilter = "Dicom (*.json)|*.json|" "All files (*.*)|*.*"
        fileDialog = wx.FileDialog(self, message ="选择账户字典", wildcard = filesFilter, style = wx.FD_OPEN)
        dialogResult = fileDialog.ShowModal()
        if dialogResult !=  wx.ID_OK:
            return
        path = fileDialog.GetPath()
        self.user_name.Value = path
        #wx.MessageBox(path)
        #self.__TextBox.SetLabel(path)

    def open_pwd(self, event):
        filesFilter = "Dicom (*.json)|*.json|" "All files (*.*)|*.*"
        fileDialog = wx.FileDialog(self, message ="选择密码字典", wildcard = filesFilter, style = wx.FD_OPEN)
        dialogResult = fileDialog.ShowModal()
        if dialogResult !=  wx.ID_OK:
            return
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

    def updateDisplay(self, msg):
        #TestThread()
        t = msg
        self.threading.SetLabel("%s"%t)


    def OnClick(self, event):

        # 设备信息
        #value = "{}".format(self.product.GetSelection())

        # url
        url = self.input_url.GetValue()
        
        # 浏览器状态信息
        browser_status = "{}".format(self.browser_bar.GetSelection())

        if self.user_name.Value == '':
            wx.MessageBox("请选择用户名字典")
        elif self.user_pwd.Value == '':
            wx.MessageBox("请选择密码字典")

        # elif value == '-1':
        #     wx.MessageBox("请选择设备！")

        elif browser_status =='-1':
            wx.MessageBox("请选择是否显示浏览器！")
        elif url == '':
            wx.MessageBox("请输入正确的地址！")

        else:
            
            # TestThread()

            self.button_start.SetLabel("正在扫描")
            self.button_stop.Enable()
            self.input_url.Enable(False)
            self.user_name.Enable(False)
            self.user_pwd.Enable(False)
            self.browser_bar.Enable(False)
            #self.product.Enable(False)
            event.GetEventObject().Enable(False)

            #测试代码
            #wx.MessageBox("OOOOOOOK！！！！")
            #time.sleep(2)
            
            # 浏览器配置
            executable_path = {'executable_path':r'Google\Chrome\chch\chromedriver'}
            
            # 浏览器状态
            if browser_status == '0': # 显示
                self.browser = Browser('chrome', **executable_path)
            if browser_status == '1': # 隐藏
                self.browser = Browser('chrome', headless=True, **executable_path)

            self.status.Value = '正在检查网页适配情况...'

            try:
                r = requests.get(url)
                r.encoding='utf-8'
                soup = BeautifulSoup(r.text,'html.parser')
                #print('1')
                
                #查找用户名标签
                try:
                    try:
                        self.u_name = soup.find(type="text")["name"]
                    except:
                        self.u_name = soup.find(type="text")["id"]
                except:

                    try:
                        self.u_name = soup.find(type="email")["name"]
                    except:
                        self.status.AppendText("\n网页信息获取失败")

                        self.status.AppendText('\n扫描结束')
                        self.browser.quit()
                        self.button_stop.Enable(False)
                        self.input_url.Enable()
                        self.user_name.Enable()
                        self.user_pwd.Enable()
                        self.browser_bar.Enable()
                        #self.product.Enable()
                        self.button_start.SetLabel("开始扫描")
                        self.button_start.Enable()
                        return()

                #查找密码标签
                try:
                    self.u_pwd = soup.find(type="password")["name"]
                except:
                    try:
                        self.u_pwd = soup.find(type="password")["id"]
                    except:
                        self.status.AppendText("\n网页信息获取失败")

                        self.status.AppendText('\n扫描结束')
                        self.browser.quit()
                        self.button_stop.Enable(False)
                        self.input_url.Enable()
                        self.user_name.Enable()
                        self.user_pwd.Enable()
                        self.browser_bar.Enable()
                        #self.product.Enable()
                        self.button_start.SetLabel("开始扫描")
                        self.button_start.Enable()
                        return()
                        
                #查找登陆标签
                try:
                    try:
                        self.u_submit = soup.find(type="button")["name"]
                    except:
                        self.u_submit = soup.find(type="button")["id"]
                except:

                    try:
                        self.u_submit = soup.find(type="submit")["name"]
                    except:
                        self.status.AppendText("\n网页信息获取失败")

                        self.status.AppendText('\n扫描结束')
                        self.browser.quit()
                        self.button_stop.Enable(False)
                        self.input_url.Enable()
                        self.user_name.Enable()
                        self.user_pwd.Enable()
                        self.browser_bar.Enable()
                        #self.product.Enable()
                        self.button_start.SetLabel("开始扫描")
                        self.button_start.Enable()
                        return()

                self.status.AppendText("\n网页信息获取成功，即将开始扫描……")
                time.sleep(2)
            except:
                self.status.AppendText("\n网页信息获取失败")
                self.status.AppendText('\n扫描结束')
                self.browser.quit()
                self.button_stop.Enable(False)
                self.input_url.Enable()
                self.user_name.Enable()
                self.user_pwd.Enable()
                self.browser_bar.Enable()
                #self.product.Enable()
                self.button_start.SetLabel("开始扫描")
                self.button_start.Enable()
                return()


            # 访问链接
            self.browser.visit(url)

            # 打开字典
            with open(self.user_pwd.Value) as pwd:
                pw = json.load(pwd)
            with open(self.user_name.Value) as us:
                users = json.load(us)

            try:
                for user in users:
                    for pwd in pw:
                        
                        self.browser.find_by_name(self.u_name).fill(user)
                        self.browser.find_by_name(self.u_pwd).fill(pwd)
                        self.browser.find_by_name(self.u_submit).click()
                        if self.browser.is_element_not_present_by_name(self.u_name):

                            self.status.AppendText("\n可能存在弱口令如下：")
                            self.status.AppendText('\nusername:%s'% user)
                            self.status.AppendText('\npassword:%s'% pwd)

                            self.status.AppendText('\n扫描结束')
                            self.browser.quit()
                            self.button_stop.Enable(False)
                            self.input_url.Enable()
                            self.user_name.Enable()
                            self.user_pwd.Enable()
                            self.browser_bar.Enable()
                            #self.product.Enable()
                            self.button_start.SetLabel("开始扫描")
                            self.button_start.Enable()
                            return()
                            
                self.status.AppendText('\n扫描结束')
                self.browser.quit()
                self.button_stop.Enable(False)
                self.input_url.Enable()
                self.user_name.Enable()
                self.user_pwd.Enable()
                self.browser_bar.Enable()
                #self.product.Enable()
                self.button_start.SetLabel("开始扫描")
                self.button_start.Enable()
                 
            except:

                self.status.AppendText('\n扫描结束')
                self.browser.quit()
                self.button_stop.Enable(False)
                self.input_url.Enable()
                self.user_name.Enable()
                self.user_pwd.Enable()
                self.browser_bar.Enable()
                #self.product.Enable()
                self.button_start.SetLabel("开始扫描")
                self.button_start.Enable()


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

if __name__ == "__main__":
    app = wx.App()
    frame = MyFrame(None, '安科弱口令检测')
    frame.Show()
    app.MainLoop()
    