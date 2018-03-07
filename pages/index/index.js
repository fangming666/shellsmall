//index.js
//获取应用实例
const app = getApp();
// 动画
Page({
  data: {
    allRate: 0,
    allGoodsNum: 0,
    headNotice: "优惠信息",
    headTitle: "商品",
    cardSwitch: false,
    afficheSwicth: false,
    afficheTitle: "这是一个商品的名称",
    afficheInit: 2000,
    afficheNow: 1000,
    afficheSold: 10,
    affichePrefer: "这是一个优惠的信息",
    afficheInfo: "这是一个公告的信息",
    goods: [{
      "img": "https://ss0.bdstatic.com/-0U0bnSm1A5BphGlnYG/tam-ogel/151fd1ab20c7d69f611a07096a65b672_121_121.jpg", "name": "这是一个商品的名称", "sold": "10", "init": "2000", "now": "1000", "allNum": 11, "num": 0, "animationData": "", "affichePrefer": "这是一个真的优惠信息", "afficheInfo": "这是一个真的公告信息"
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

  onLoad: function () {

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
      afficheSwicth: false
    })
  },
  openAfficheOne() {
    this.setData({
      afficheSwicth: true
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
      afficheInfo: this.data.goods[index].afficheInfo,
      afficheSwicth: true
    })
  }
})
