//index.js
//获取应用实例
const app = getApp();
let buttonFlag = true;
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
    btnDisabled: false,
     hide_good_box: true

  },
  onShow: function () {


  },
  onLoad: function () {
    /*****获取公告信息***/
    wx.request({
      url: 'https://cloudvip.vip/sell/bulletin/info',
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



    /**获取商品列表****/
    let that = this;
    wx.getStorage({
      key: 'openID',
      success: function (res) {
        that.setData({
          openId: res.data
        });
        wx.request({
          url: 'https://cloudvip.vip/sell/product/list',
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


      },
    })

    this.busPos = {};
    this.busPos["x"] = app.globalData.ww -45;
    this.busPos["y"] = app.globalData.hh -125;


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
        url: 'https://cloudvip.vip/sell/cart/list',
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
    if (!buttonFlag) return;
    let allNum = this.data.allGoodsNum;
    let id = e.currentTarget.dataset.index;
    let resultArr = this.data.goods;
    let cartArr = this.data.cartGoods;
    let goodIndex = "";
    let reduceFuc = (arr) => {
      arr.map((item, index) => {
        if (item.id == id) {
          goodIndex = index;
        }
      })
      if (arr[goodIndex].number == 0) {
        arr[goodIndex].number = 0;
      } else {
        arr[goodIndex].number = arr[goodIndex].number - 1;
      };
      allNum = arr[goodIndex].number
    }
    reduceFuc(cartArr);
    reduceFuc(resultArr);
    this.setData({
      goods: resultArr,
      cartGoods: cartArr,
      allGoodsNum: allNum
    });
    buttonFlag = false;
    wx.request({
      url: 'https://cloudvip.vip/sell/cart/change',
      method: "POST",
      data: { "openId": this.data.openId, "productId": id, "number": resultArr[goodIndex].number },
      success: res => {
        if (res.data.code === 0) {
          buttonFlag = true;
          this.inquiryPrice()
        }
      }
    })
  },
  /*******增加商品数量的方法*********/
  addNum(e) {
    if (!buttonFlag) return;
    let allNum = this.data.allGoodsNum;
    let id = e.currentTarget.dataset.index;
    let resultArr = this.data.goods;
    let cartArr = this.data.cartGoods;
    let goodIndex = "";
    let addFuc = (arr) => {
      arr.map((item, index) => {
        if (item.id == id) {
          goodIndex = index;
        }
      })
      if (arr[goodIndex].number == arr[goodIndex].stock) {
        arr[goodIndex].number = arr[goodIndex].stock;
      } else {
        arr[goodIndex].number = arr[goodIndex].number + 1;
      };
      allNum = arr[goodIndex].number
    }

    if (this.data.cardSwitch) {
      addFuc(cartArr);
    }
    addFuc(resultArr);
    this.setData({
      goods: resultArr,
      cartGoods: cartArr,
      allGoodsNum: allNum
    });

    /*********小球的飞入动画************/

    this.finger = {}; var topPoint = {};
    this.finger['x'] = e.touches["0"].clientX;
    this.finger['y'] = e.touches["0"].clientY;
    if (this.finger['y'] < this.busPos['y']) {
      topPoint['y'] = this.finger['y'] - 150;
    } else {
      topPoint['y'] = this.busPos['y'] - 150;
    }
    topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2;
    this.linePos = app.bezier([this.finger, topPoint, this.busPos], 30);
    this.startAnimation();


    buttonFlag = false;
    wx.request({
      url: 'https://cloudvip.vip/sell/cart/change',
      method: "POST",
      data: { "openId": this.data.openId, "productId": id, "number": resultArr[goodIndex].number },
      success: res => {
        if (res.data.code === 0) {
          buttonFlag = true;
          this.inquiryPrice()
        }
      }
    })
  },

  /****小球的动画****/
  startAnimation: function () {
    var index = 0, that = this,
      bezier_points = that.linePos['bezier_points'];
    this.setData({
      hide_good_box: false,
      bus_x: that.finger['x'],
      bus_y: that.finger['y']
    })
    this.timer = setInterval(function () {
      index++;
      that.setData({
        bus_x: bezier_points[index]['x'],
        bus_y: bezier_points[index]['y']
      })
      if (index >= 28) {
        clearInterval(that.timer);
        that.setData({
          hide_good_box: true,
          hideCount: false,
          count: that.data.count += 1
        })
      }
    }, 33);
  },
  /****查询购物车的价格***/
  inquiryPrice() {
    wx.request({
      url: 'https://cloudvip.vip/sell/cart/totalPrice',
      method: "POST",
      data: { "openId": this.data.openId },
      success: res => {
        this.setData({
          allRate: res.data.data.totalPrice
        })
      }
    })

  },


  /*******清空购物车*****/
  clearCart() {
    wx.request({
      url: "https://cloudvip.vip/sell/cart/clear",
      method: "POST",
      data: { "openId": this.data.openId },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            cartGoods: []
          })
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
})
