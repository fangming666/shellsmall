// pages/news/news.js
const app = getApp();
const baseUrl = app.globalData.baseUrl;
const imageUrl = app.globalData.imgUrl;
const openIdPromise = require("/../openId.js").openId;
const dataJson = require("./../module.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        newsTitle: "消息列表",
        sendInfo: "",
        openId: "",
        orderKong: false,
        userInfo: {},
        KongSrc: `${imageUrl}/no_data.png`,
        newsList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '消息'
        })
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                if (!res.userInfo.avatarUrl) {
                    res.userInfo.avatarUrl = `${imageUrl}/customer_ service.jpg`
                }
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    if (!res.userInfo.avatarUrl) {
                        res.userInfo.avatarUrl = `${imageUrl}/customer_ service.jpg`
                    }
                    app.globalData.userInfo = res.userInfo;
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        };
        /********获取消息列表*****/

        this.getNew();
    },
    getNew() {
        let that = this;
        let nowDate = Date.parse(new Date());
        openIdPromise.then(res => {
            that.setData({
                openId: res
            });
            dataJson.getNews(res).then(res => {
                if (res.data.length) {
                    let arr = res.data;
                    res.data.map((item, index) => {
                        /***0是用户,1是系统**/
                        item.img = `${imageUrl}/customer_ service.jpg`;
                        console.log(item.timeStamp - nowDate)
                        item.timeStamp = Math.abs(item.timeStamp - nowDate) / 1000 <= 60 ? "刚刚" : Math.abs(item.timeStamp - nowDate) / 1000 <= 600 ? `${Number.parseInt(Math.abs(item.timeStamp - nowDate) / 60000)}分钟之前` : dataJson.timetrans(item.timeStamp)
                    });
                    that.setData({
                        newsList: arr
                    })
                } else {
                    that.setData({
                        orderKong: true
                    })
                }
                console.log(res)
            })
        })
    },

    /******获得输入框的内容****/
    getInfo(e) {
        this.setData({
            sendInfo: e.detail.value
        })
    },

    /***点击发送触发的事件****/
    sendMsg() {
        wx.showToast({
            title: '发送中',
            icon: "none"
        })
        let that = this;
        wx.request({
            url: `${baseUrl}/sell/message/send`,
            method: "POST",
            data: {
                "openId": this.data.openId,
                "msg": this.data.sendInfo
            },
            success: res => {
                console.log(res);
                if (res.data.code == 0) {
                    that.setData({
                        sendInfo: ""
                    });
                    that.getNew();
                    wx.showToast({
                        title: '发送成功',
                        icon: "success"
                    })
                }
            }
        })

    }
})
