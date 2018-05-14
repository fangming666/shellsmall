
const app = getApp();
const baseUrl = app.globalData.baseUrl;

/***获取商品列表***/
var getGoods = function (openId) {
  wx.showLoading({
    title: '加载中',
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}/sell/product/list`,
      method: "POST",
      data: { "openId": openId },
      success: res => {
        if (res.data.code === 0) {
          wx.hideLoading();
          resolve(res.data.data)
        } else {
          reject("获取商品出错")
        }
      }
    });
  })
}


/**获得购物车的总数量**/
var allGoodsNum = function (openId) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: baseUrl + '/sell/cart/list',
      method: "POST",
      data: { "openId": openId },
      success: function (res) {
        let sum = 0;
        if (res.data.data.length) {
          res.data.data.map(item => {
            sum = sum + item.number;
          })
        }
        resolve(sum);
      }
    });
  })

};

/*****获取购物车列表****/
var cartGoods = function (openId) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${baseUrl}/sell/cart/list`,
      method: "POST",
      data: { "openId": openId },
      success: res => {
        resolve(res.data.data)
      },
      fail: err => {
        reject("err" + err)
      }
    })
  })
};

/**获得购物车内的价格***/
var allRate = function (openId) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: baseUrl + '/sell/cart/totalPrice',
      method: "POST",
      data: { "openId": openId },
      success: function (res) {
        resolve(res.data.data.totalPrice);
      },
    });
  })
};

/****获取order列表****/
var orderList = function (openId) {
  wx.showLoading({
    title: '加载中',
  })
  return new Promise(function (resolve, reject) {
    wx.request({
      url: baseUrl + "/sell/order/payList",
      method: "POST",
      data: { "openId": openId },
      success: res => {
        resolve(res.data);
        wx.hideLoading();
      },
      fail: err => {
        reject(err)
      }
    });
  })
}

/***获取消息列表***/
var getNews = function (openId) {
  wx.showLoading({
    title: '加载中',
  })
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${baseUrl}/sell/message/list`,
      method: "POST",
      data: { "openId": openId },
      success: res => {
        resolve(res.data)
        wx.hideLoading()
      },
    })
  })
}
/***获取key列表***/
var getKeys = function (openId) {
  wx.showLoading({
    title: '加载中',
  })
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${baseUrl}/sell/key/list`,
      method: "POST",
      data: { "openId": openId },
      success: res => {
        resolve(res.data)
        wx.hideLoading()
      },
    })
  })
}

/***时间戳转化为时间****/
var timetrans = function (date) {
  var date = new Date(date);//如果date为13位不需要乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return Y + M + D + h + m + s;
}

module.exports = {
  getGoods: getGoods,
  allGoodsNum: allGoodsNum,
  allRate: allRate,
  cartGoods: cartGoods,
  orderList: orderList,
  getNews: getNews,
  timetrans: timetrans,
  getKeys: getKeys
}
