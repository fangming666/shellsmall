// pages/order/order.js
const app = getApp();
const baseUrl = app.globalData.baseUrl;
const openIdPromise = require("/../openId.js").openId;
const dataJson = require("./../module.js");
const imageUrl = app.globalData.imgUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderTitle: "订单列表",
    openId: "",
    arr: [],
    orderKong: false,
    KongSrc: "./../../img/Kong.png" //`${imageUrl}/Kong.png`
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
    openIdPromise.then(res => {
      dataJson.orderList(res).then(res => {
        let nowDate = Date.parse(new Date());
        if (res.code === 0) {
          res.data.map(item => {
            item.timeStamp
          })
          that.setData({
            arr: res.data
          })
        } else {
          that.setData({
            orderKong: true
          })
        }
      })
    })

  },

 

 
})