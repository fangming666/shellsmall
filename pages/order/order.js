// pages/order/order.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderTitle: "订单列表",
    openId: "",
    orderTime: "",
    orderBuyNum: "",
    payFlag: "",
    orderNum:"",
    orderList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /********获取订单列表*****/
    let that = this;
    wx.getStorage({
      key: 'openID',
      success: function (res) {
        that.setData({
          openId: res.data
        });
        wx.request({
          url: 'https://cloudvip.vip/sell/order/list',
          method: "POST",
          data: { "openId": res.data },
          success: res => {
            if (res.data.code === 0) {
              console.log(res.data);
              that.setData({
                orderTime: res.data.data.timeStamp,
                orderBuyNum: res.data.data.number,
                payFlag: res.data.data.payFlag ? "已支付" : "未支付",
                orderNum: res.data.data.unionCode,
                orderList: res.data.data.keys
              })
            }
          }
        });


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