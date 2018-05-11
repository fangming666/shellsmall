
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
        if (res.data.data.length) {
          let sum = 0;
          res.data.data.map(item => {
            sum = sum + item.number;
          })
          resolve(sum);
        } else {
          reject("获取购物车总数为0")
        }
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


module.exports = {
  getGoods: getGoods,
  allGoodsNum: allGoodsNum,
  allRate: allRate,
  cartGoods: cartGoods,
  orderList: orderList
}
