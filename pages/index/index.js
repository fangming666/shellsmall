//index.js
//获取应用实例
const app = getApp();
let buttonFlag = true;
const baseUrl = app.globalData.baseUrl;
const imageUrl = app.globalData.imgUrl;
const openIdPromise = require("./../openId.js").openId;
const dataJson = require("./../module.js");

Page({
  data: {
    addIcon: `${imageUrl}/add.png`,
    reduceIcon: `${imageUrl}/reduce.png`,
    cartIcon: `${imageUrl}/cart.png`,
    clooseIcon: `${imageUrl}/cloose.png`,
    allRate: 0,
    allGoodsNum: 0,
    headNotice: "优惠信息",
    headTitle: "商品",
    animationData: {},
    cardSwitch: false,
    animationAffiche: {},
    afficheSwicth: false,
    afficheSwicthOne: false,
    afficheSwicthTwo: false,
    afficheTitle: "这是一个商品的名称",
    afficheInit: 2000,
    afficheNow: 1000,
    afficheSold: 10,
    affichePrefer: "这是一个优惠的信息",
    goods: [],
    cartGoods: [],
    openId: "",
    btnDisabled: false

  },
  onLoad: function () {
    let that = this;
    /***设置头部区域***/
    wx.setNavigationBarTitle({
      title: '首页'
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#343234',
      animation: {
        timingFunc: 'easeIn'
      }
    })
    /*****获取公告信息***/
    wx.request({
      url: `${baseUrl}/sell/bulletin/info`,
      method: "GET",
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            headNotice: res.data.data.bulletin
          });
        }
      }
    })
    openIdPromise.then((res) => {
      that.setData({
        openId: res
      })
      /***获取购物车总数量***/
      dataJson.allGoodsNum(res).then(res => {
        that.setData({
          allGoodsNum: res
        })
      })

      /**获取商品列表**/
      dataJson.getGoods(res).then(res => {
        let temporaryGoods = res;
        if (!this.data.allGoodsNum) {
          temporaryGoods.map((item) => {
            item.number = 0
          });
          that.setData({
            goods: temporaryGoods
          });
        } else {
          dataJson.cartGoods(that.data.openId).then(res => {
            temporaryGoods.map((item) => {
              res.map((item2) => {
                if (item.id === item2.productId) {
                  item.number = item2.number
                } else {
                  item.number = 0
                }
              })
            });
            that.setData({
              goods: temporaryGoods
            });
          })
        }
  
        
      })

      /*****获得购物车内的价格*****/
      dataJson.allRate(res).then(res => {
        that.setData({
          allRate: res
        })
      })
    });
  },
  /*****下拉刷新****/
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    let that = this;
    /**获取商品列表**/
    dataJson.getGoods(this.data.openId).then(res => {
      that.setData({
        goods: res
      });
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    })

  },



  /*****显示购物车******/
  toggleCard() {
    let cardSwitchS = this.data.cardSwitch
    this.setData({
      cardSwitch: !cardSwitchS
    });
    if (this.data.cardSwitch) {
      this.cascadePopup();
      let that = this;
      dataJson.cartGoods(that.data.openId).then(res => {
        let arr = []
        that.data.goods.map((item) => {
          res.map((items) => {
            if (item.id == items.productId) {
              item.number = items.number;
              arr.push(item);
            }
          })
        });
        that.setData({
          cartGoods: arr
        })
      })
    } else {
      this.cascadeDismiss()
    }

  },

  /****关闭购物车**/
  closeCard() {
    this.setData({
      cardSwitch: false
    });
    this.cascadeDismiss();
  },
  cascadePopup: function () {    // 购物车打开动画
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    });
    this.animation = animation;
    animation.opacity(1).step();
    this.setData({
      animationData: this.animation.export(),
    });
  },
  cascadeDismiss: function () {        // 购物车关闭动画
    this.animation.opacity(0).step();
    this.setData({
      animationData: this.animation.export(),
    });
  },



  /****减少商品数量的方法****/
  reduceNum(e) {
    wx.showLoading({
    });
    if (!buttonFlag) return;
    let allNum = this.data.allGoodsNum;
    let stop = false;
    let id = e.currentTarget.dataset.index;
    let resultArr = this.data.goods;
    let cartArr = this.data.cartGoods;
    let goodIndex = "";
    let reduceFuc = (arr, dis) => {
      arr.map((item, index) => {
        if (item.id == id) {
          goodIndex = index;
        }
      })
      if (arr[goodIndex].number <= 0) {
        arr[goodIndex].number = 0;
        stop = true;
      } else {
        arr[goodIndex].number = arr[goodIndex].number - 1;
      };
      if (dis) {
        if (stop) {
          allNum = allNum;
        } else {
          allNum = allNum - 1;
        }
        allNum = allNum <= 0 ? 0 : allNum;

        this.setData({
          allGoodsNum: allNum,
        })
      }
    }
    if (this.data.cardSwitch) {
      reduceFuc(cartArr, 0);
    }
    reduceFuc(resultArr, 1);
    if (allNum <= 0) {
      cartArr = []
    }
    buttonFlag = false;
    wx.request({
      url: `${baseUrl}/sell/cart/change`,
      method: "POST",
      data: { "openId": this.data.openId, "productId": id, "number": resultArr[goodIndex].number },
      success: res => {
        if (res.data.code === 0) {
          buttonFlag = true;
          dataJson.allRate(this.data.openId).then(res => {
            this.setData({
              allRate: res
            })
          })
          wx.hideLoading();
          this.setData({
            goods: resultArr,
            cartGoods: cartArr
          });
        }
      }
    })
  },

  /*******增加商品数量的方法*********/
  addNum(e) {
    wx.showLoading({
    });
    if (!buttonFlag) return;
    let stop = false;
    let allNum = this.data.allGoodsNum;
    let id = e.currentTarget.dataset.index;
    let resultArr = this.data.goods;
    let cartArr = this.data.cartGoods;
    let goodIndex = "";
    let addFuc = (arr, dis) => {
      arr.map((item, index) => {
        if (item.id == id) {
          goodIndex = index;
        }
      })
      if (arr[goodIndex].number == arr[goodIndex].stock) {
        arr[goodIndex].number = arr[goodIndex].stock;
        wx.showToast({
          title: '库存不足',
          icon: 'none',
          duration: 500
        })
        stop = true;
      } else {
        arr[goodIndex].number = arr[goodIndex].number + 1;
      };
      if (dis) {
        if (stop) {
          allNum = allNum;
        } else {
          allNum = allNum + 1;
        }
        this.setData({
          allGoodsNum: allNum
        })
      }
    }

    if (this.data.cardSwitch) {
      addFuc(cartArr, 0);
    }
    addFuc(resultArr, 1);
    this.setData({
      goods: resultArr,
      cartGoods: cartArr,
    });
    buttonFlag = false;
    wx.request({
      url: `${baseUrl}/sell/cart/change`,
      method: "POST",
      data: { "openId": this.data.openId, "productId": id, "number": resultArr[goodIndex].number },
      success: res => {
        if (res.data.code === 0) {
          buttonFlag = true;
          dataJson.allRate(this.data.openId).then(res => {
            this.setData({
              allRate: res
            })
          })
        }
        else {
          console.log(res.data);
        }
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },




  /*******清空购物车*****/
  clearCart() {
    wx.request({
      url: `${baseUrl}/sell/cart/clear`,
      method: "POST",
      data: { "openId": this.data.openId },
      success: res => {
        if (res.data.code == 0) {
          let goodsArr = this.data.goods;
          goodsArr.map((item) => {
            item.number = 0
          })
          this.setData({
            cartGoods: [],
            goods: goodsArr,
            allRate: 0,
            allGoodsNum: 0
          });
        }
      }
    })
  },
  /****关闭公告模态框*****/
  clooseAffiche() {
    this.setData({
      afficheSwicth: false,
      afficheSwicthOne: false,
      afficheSwicthTwo: false
    });
    this.afficheStatu()
  },
  /****打开公告模态框***/
  openAfficheOne() {
    this.setData({
      afficheSwicth: true,
      afficheSwicthOne: true
    });
    this.afficheStatu()
  },
  /***打开商品模态框***/
  openAfficheTwo(e) {
    let index = e.currentTarget.dataset.item;
    this.setData({
      afficheTitle: this.data.goods[index].name,
      afficheInit: this.data.goods[index].originalPrice,
      afficheNow: this.data.goods[index].presentPrice,
      afficheSold: this.data.goods[index].sold,
      affichePrefer: this.data.goods[index].preferential,
      stock: this.data.goods[index].stock,
      afficheSwicthTwo: true,
      afficheSwicth: true,
    })
    this.afficheStatu()
  },

  afficheStatu() {
    if (this.data.afficheSwicth) {
      this.affichePopup()
    } else {
      this.afficheDismiss()
    }
  },
  affichePopup: function () {    // 公告栏打开动画
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    });
    this.animation = animation;
    animation.opacity(1).step();
    this.setData({
      animationAffiche: this.animation.export(),
    });
  },
  afficheDismiss: function () {        // 公告栏关闭动画
    this.animation.opacity(0).step();
    this.setData({
      animationAffiche: this.animation.export(),
    });
  },

  // 进行支付
  clickPay() {
    let that = this;
    wx.request({
      url: `${baseUrl}/sell/cart/list`,
      method: "POST",
      data: { "openId": this.data.openId },
      success: res => {
        if (res.data.data.length) {
          wx.request({
            url: `${baseUrl}/sell/user/pay`,
            method: "POST",
            data: { "openId": this.data.openId },
            success: res => {
              wx.requestPayment({
                'timeStamp': "" + JSON.parse(res.data.data).timeStamp,
                'nonceStr': JSON.parse(res.data.data).nonceStr,
                'package': JSON.parse(res.data.data).package,
                'signType': JSON.parse(res.data.data).signType,
                'paySign': JSON.parse(res.data.data).paySign,
                'success': function (res) {
                  let temporaryGoods = that.data.goods;
                  temporaryGoods.map((item) => {
                    item.number = 0
                  });
                  dataJson.allRate(that.data.openId).then(res => {
                    that.setData({
                      allRate: res
                    })
                  })
                  that.clearCart();
                  that.setData({
                    goods: temporaryGoods,
                    allGoodsNum: 0,

                  });
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 1500
                  })
                },
                'fail': function (res) {
                  console.log(res);
                  dataJson.allRate(that.data.openId).then(res => {
                    that.setData({
                      allRate: res
                    })
                  })
                  wx.showToast({
                    title: '支付失败',
                    icon: 'none',
                    duration: 1500
                  })
                }
              })
            }
          })
        } else {
          wx.showToast({
            title: '购物车为空，请添加商品',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  }
})
