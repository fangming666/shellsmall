// pages/my/my.js
const app = getApp();
const baseUrl = app.globalData.baseUrl;
const imageUrl = app.globalData.imgUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    loginImg: `${imageUrl}/right.png`,
    rightIcon: `${imageUrl}/right.png`,
    myList: [{ "href": "/pages/order/order", "text": "订单", "img": `${imageUrl}/dingDan.jpg` },
    { "href": "/pages/key/key", "text": "key", "img": `${imageUrl}/key.jpg` },
    { "href": "/pages/news/news", "text": "消息列表", "img": `${imageUrl}/xiaoXi.jpg` }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的'
    })



  },
  openAlert() {
    wx.showModal({
      title: '提示',
      content: '请先进行登录',
      showCancel: false
    })
  },
  login() {
    let that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        if (!res.userInfo.avatarUrl) {
          res.userInfo.avatarUrl = "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3289761550,697278018&fm=27&gp=0.jpg"
        }
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          if (!res.userInfo.avatarUrl) {
            res.userInfo.avatarUrl = "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3289761550,697278018&fm=27&gp=0.jpg"
          }
          app.globalData.userInfo = res.userInfo;
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
    console.log(this.data.userInfo)
  }
})