//app.js
// const baseUrl = "https://dapeng12.mynatapp.cc"
const baseUrl = "https://cloudvip.vip"
const imgUrl = "https://cloudvip.vip/sell_wx"
const Promise = require("./pages/promise.js")
App({
  onLaunch: function () {

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code = res.code;
        wx.request({
          url: `${baseUrl}/sell/user/openId`,
          method: "POST",
          data: { "code": code },
          success: res2 => {
            wx.setStorage({
              key: 'openID',
              data: res2.data.data.openid,
            })
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    //判断登录状态然后进行openID的操作
    wx.checkSession({
      success: () => {

      },
      fail: () => {
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: `${baseUrl}/sell/user/openId`,
              method: "POST",
              data: { "code": res.code },
              success: res => {
                wx.setStorage({
                  key: 'openID',
                  data: res.data.data.openid,
                })
              }
            })
          }
        })
      }
    });
  },
  globalData: {
    userInfo: null,
    openId: "",
    baseUrl: baseUrl,
    imgUrl: imgUrl
  }
})