// pages/news/news.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsTitle: "消息列表",
    sendInfo: "",
    openId: "",
    userInfo: {},
    newsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
          res.userInfo.avatarUrl = "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3289761550,697278018&fm=27&gp=0.jpg"
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
            res.userInfo.avatarUrl = "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3289761550,697278018&fm=27&gp=0.jpg"
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
    this.getNews();
  },


  /******获得输入框的内容****/
  getInfo(e) {
    this.setData({
      sendInfo: e.detail.value
    })
  },

  /***获取消息列表的方法***/
  getNews() {
    let that = this;
    wx.getStorage({
      key: 'openID',
      success: function (res) {
        that.setData({
          openId: res.data
        });
        wx.request({
          url: 'https://cloudvip.vip/sell/message/list',
          method: "POST",
          data: { "openId": res.data },
          success: res => {
            let arr = res.data.data;
            res.data.data.map((item, index) => {
              /***0是用户,1是系统**/
              item.img = "https://ss0.bdstatic.com/-0U0bnSm1A5BphGlnYG/tam-ogel/151fd1ab20c7d69f611a07096a65b672_121_121.jpg"
            });
            that.setData({
              newsList: arr
            })
          },
        })
      }
    })
  },
  /***点击发送触发的事件****/
  sendMsg() {
    let that = this;
    wx.request({
      url: "https://cloudvip.vip/sell/message/send",
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
          that.getNews()
        }
      }
    })
  
  }
})
