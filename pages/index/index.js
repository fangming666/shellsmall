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
    goods: [{
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
  }
})
