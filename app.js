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