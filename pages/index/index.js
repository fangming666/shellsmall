//index.js
//获取应用实例
const app = getApp();
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
    cardSwitch: false,
    afficheSwicth: false,
    afficheSwicthOne: false,
    afficheSwicthTwo: false,
    afficheTitle: "这是一个商品的名称",
    afficheInit: 2000,
    afficheNow: 1000,
    afficheSold: 10,
    affichePrefer: "这是一个优惠的信息",
    goods: [{
      "img": "https://ss0.bdstatic.com/-0U0bnSm1A5BphGlnYG/tam-ogel/151fd1ab20c7d69f611a07096a65b672_121_121.jpg", "name": "这是一个商品的名称", "sold": "10", "init": "2000", "now": "1000", "allNum": 11, "num": 0, "animationData": "", "affichePrefer": "这是一个真的优惠信息"
    }, {
      "img": "https://ss0.bdstatic.com/-0U0bnSm1A5BphGlnYG/tam-ogel/151fd1ab20c7d69f611a07096a65b672_121_121.jpg", "name": "这是一个商品的名称", "sold": "10", "init": "2000", "now": "1000", "allNum": 11, "num": 0, "animationData": ""
    }, {
      "img": "https://ss0.bdstatic.com/-0U0bnSm1A5BphGlnYG/tam-ogel/151fd1ab20c7d69f611a07096a65b672_121_121.jpg", "name": "这是一个商品的名称", "sold": "10", "init": "2000", "now": "1000", "allNum": 11, "num": 0, "animationData": ""
    }, {
      "img": "https://ss0.bdstatic.com/-0U0bnSm1A5BphGlnYG/tam-ogel/151fd1ab20c7d69f611a07096a65b672_121_121.jpg", "name": "这是一个商品的名称", "sold": "10", "init": "2000", "now": "1000", "allNum": 11, "num": 0, "animationData": ""
    }, {
      "img": "https://ss0.bdstatic.com/-0U0bnSm1A5BphGlnYG/tam-ogel/151fd1ab20c7d69f611a07096a65b672_121_121.jpg", "name": "这是一个商品的名称", "sold": "10", "init": "2000", "now": "1000", "allNum": 11, "num": 0, "animationData": ""
    }, {
      "img": "https://ss0.bdstatic.com/-0U0bnSm1A5BphGlnYG/tam-ogel/151fd1ab20c7d69f611a07096a65b672_121_121.jpg", "name": "这是一个商品的名称", "sold": "10", "init": "2000", "now": "1000", "allNum": 11, "num": 0, "animationData": ""
    }, {
      "img": "https://ss0.bdstatic.com/-0U0bnSm1A5BphGlnYG/tam-ogel/151fd1ab20c7d69f611a07096a65b672_121_121.jpg", "name": "这是一个商品的名称", "sold": "10", "init": "2000", "now": "1000", "allNum": 11, "num": 0, "animationData": ""
    }, {
      "img": "https://ss0.bdstatic.com/-0U0bnSm1A5BphGlnYG/tam-ogel/151fd1ab20c7d69f611a07096a65b672_121_121.jpg", "name": "这是一个商品的名称", "sold": "10", "init": "2000", "now": "1000", "allNum": 11, "num": 0, "animationData": ""
    }],

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

    /****微信登录时候获取openId***/
    wx.login({
      success: res => {
        if (res.code) {
          let appId = "wx9c608a6237178170";
          let secret = "wx9c608a6237178170";
          wx.request({
            // url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${res.code}&grant_type=authorization_code`,
          })
        }
      }
    })
    /**获取商品列表****/
    // wx.request({
    //   url: 'https://cloudvip.vip/sell/product/list',
    //   method: "POST",
    //   data: {

    //   }
    // })

  },
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
  reduceNum(e) {
    let index = e.currentTarget.dataset.item;
    let allNum = this.data.allGoodsNum;
    let resultArr = this.data.goods;
    if (resultArr[index].num == 0) {
      resultArr[index].num = 0;

    } else {
      resultArr[index].num = resultArr[index].num - 1;
      this.setData({
        allGoodsNum: allNum - 1
      })
    };
    this.setData({
      goods: resultArr
    })
  },
  addNum(e) {
    let index = e.currentTarget.dataset.item;
    let resultArr = this.data.goods;
    let allNum = this.data.allGoodsNum;
    if (resultArr[index].num == resultArr[index].allNum) {
      resultArr[index].num = resultArr[index].allNum
    } else {
      resultArr[index].num = resultArr[index].num + 1;
      this.setData({
        allGoodsNum: allNum + 1
      })
    };
    this.setData({
      goods: resultArr
    })
  },

  toggleCard() {
    let cardSwitchS = this.data.cardSwitch
    this.setData({
      cardSwitch: !cardSwitchS
    });

  },
  clooseCard() {
    this.setData({
      cardSwitch: false
    })
  },
  clooseAffiche() {
    console.log(this.data.afficheSwicth);
    this.setData({
      afficheSwicth: false,
      afficheSwicthOne: false,
      afficheSwicthTwo: false
    })
  },
  openAfficheOne() {
    this.setData({
      afficheSwicth: true,
      afficheSwicthOne: true
    })
  },
  openAfficheTwo(e) {
    let index = e.currentTarget.dataset.item;
    this.setData({
      afficheTitle: this.data.goods[index].name,
      afficheInit: this.data.goods[index].init,
      afficheNow: this.data.goods[index].now,
      afficheSold: this.data.goods[index].sold,
      affichePrefer: this.data.goods[index].affichePrefer,
      afficheSwicth: true,
      afficheSwicthTwo: true
    })
  }
})
