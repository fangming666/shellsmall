// pages/order/order.js
const app = getApp();
const baseUrl = app.globalData.baseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderTitle: "订单列表",
    openId: "",
    arr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单'
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#888',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    /********获取订单列表*****/
    let that = this;
    wx.getStorage({
      key: 'openID',
      success: function (res) {
        that.setData({
          openId: res.data
        });
        if (res.data) {
          wx.request({
            url: `${baseUrl}/sell/order/payList`,
            method: "POST",
            data: { "openId": res.data },
            success: res => {
              let nowDate = Date.parse(new Date());
              console.log(nowDate);
              if (res.data.code === 0) {
                console.log(res.data);
                res.data.data.map(item => {
                  item.timeStamp
                })
                that.setData({
                  arr: res.data.data
                })
              }
            }
          });
        }



      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})