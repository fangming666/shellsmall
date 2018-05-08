//index.js
//获取应用实例
const app = getApp();
let buttonFlag = true;
const baseUrl = app.globalData.baseUrl;
// 动画
Page({
  data: {
    marqueePace: 1,//滚动速度
    marqueeDistance2: 0, //初始滚动距离
    size: 14,
    marquee2copy_status: false,
    marquee2_margin: 60,
    orientation: 'left',//滚动方向
    interval: 20, // 时间间隔
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
  onShow: function () {


  },
  onLoad: function () {
    /*****获取公告信息***/
    wx.request({
      url: `${baseUrl}/sell/bulletin/info`,
      method: "GET",
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            headNotice: res.data.data.bulletin
          });
          var vm = this;
          var length = vm.data.headNotice.length * vm.data.size;//文字长度
          var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
          vm.setData({
            length: length,
            windowWidth: windowWidth,
          });
          vm.run2();// 第一个字消失后立即从右边出现
        }
      }
    })

    this.getGoods();


  },
  /*****下拉刷新****/
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    let that = this;
    wx.getStorage({
      key: 'openID',
      success: function (res) {
        that.setData({
          openId: res.data
        });
        if (res.data) {
          wx.request({
            url: `${baseUrl}/sell/product/list`,
            method: "POST",
            data: { "openId": res.data },
            success: res => {
              if (res.data.code === 0) {
                wx.hideNavigationBarLoading() //完成停止加载
                wx.stopPullDownRefresh() //停止下拉刷新
                that.clearCart();
                let temporaryGoods = res.data.data;
                temporaryGoods.map((item) => {
                  item.number = 0
                });
                that.setData({
                  goods: temporaryGoods
                });
              }
            }
          });
          /**获取购物车的总价格****/
          that.inquiryPrice();
        }

        wx.showToast({
          title: '刷新完成',
          icon: 'none',
          duration: 1000
        })

      },
      fail: () => {
        wx.showToast({
          title: '刷新失败',
          icon: 'none',
          duration: 1000
        })
      }
    })

  },

  /**获取商品列表****/
  getGoods() {
    let that = this;
    wx.getStorage({
      key: 'openID',
      success: function (res) {
        that.setData({
          openId: res.data
        });
        if (res.data) {
          wx.request({
            url: `${baseUrl}/sell/product/list`,
            method: "POST",
            data: { "openId": res.data },
            success: res => {
              if (res.data.code === 0) {
                let temporaryGoods = res.data.data;
                temporaryGoods.map((item) => {
                  item.number = 0
                });
                that.setData({
                  goods: temporaryGoods
                });
              }
            }
          });
          /**获取购物车的总价格****/
          that.inquiryPrice();
          /**获得购物车的总数量**/
          wx.request({
            url: `${baseUrl}/sell/cart/list`,
            method: "POST",
            data: { "openId": res.data },
            success: res => {
              if (res.data.data.length) {
                that.setData({
                  allGoodsNum: res.data.data.length
                })
              } else {
              }
            }
          })
        }


      },
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
      /*****获取购物车列表****/
      wx.request({
        url: `${baseUrl}/sell/cart/list`,
        method: "POST",
        data: { "openId": that.data.openId },
        success: res => {
          let arr = []
          that.data.goods.map((item) => {
            res.data.data.map((items) => {
              if (item.id == items.productId) {
                item.number = items.number;
                arr.push(item);
              }
            })
          });
          // arr = that.data.allGoodsNum <= 0 ? [] : arr;
          that.setData({
            cartGoods: arr
          })
        }
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

  /*******公告栏的跑马灯效果********/
  run2: function () {
    var vm = this;
    var interval = setInterval(function () {
      if (-vm.data.marqueeDistance2 < vm.data.length) {
        // 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示
        vm.setData({
          marqueeDistance2: vm.data.marqueeDistance2 - vm.data.marqueePace,
          marquee2copy_status: vm.data.length + vm.data.marqueeDistance2 <= vm.data.windowWidth + vm.data.marquee2_margin,
        });
      } else {
        if (-vm.data.marqueeDistance2 >= vm.data.marquee2_margin) { // 当第二条文字滚动到最左边时
          vm.setData({
            marqueeDistance2: vm.data.marquee2_margin // 直接重新滚动
          });
          clearInterval(interval);
          vm.run2();
        } else {
          clearInterval(interval);
          vm.setData({
            marqueeDistance2: -vm.data.windowWidth
          });
          vm.run2();
        }
      }
    }, vm.data.interval);
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
          this.inquiryPrice();
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
          this.inquiryPrice();
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

  /********/

  /****查询购物车的价格***/
  inquiryPrice() {
    wx.request({
      url: `${baseUrl}/sell/cart/totalPrice`,
      method: "POST",
      data: { "openId": this.data.openId },
      success: res => {
        this.setData({
          allRate: res.data.data.totalPrice
        })
      },
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
                  that.setData({
                    goods: temporaryGoods,
                    allGoodsNum:0
                  });
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 1500
                  })
                },
                'fail': function (res) {
                  console.log(res);
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
