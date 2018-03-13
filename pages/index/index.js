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
        cardSwitch: false,
        afficheSwicth: false,
        afficheSwicthOne: false,
        afficheSwicthTwo: false,
        afficheTitle: "这是一个商品的名称",
        afficheInit: 2000,
        afficheNow: 1000,
        afficheSold: 10,
        affichePrefer: "这是一个优惠的信息",
        goods: [],
        openId: "",
        btnDisabled: false

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
                                item.initNum = 0
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
        let index = e.currentTarget.dataset.index;
        let resultArr = this.data.goods;
        if (resultArr[index].initNum == 0) {
            resultArr[index].initNum = 0;
        } else {
            resultArr[index].initNum = resultArr[index].initNum - 1;
        };
        this.setData({
            goods: resultArr
        });
        buttonFlag = false;
        wx.request({
            url: 'https://cloudvip.vip/sell/cart/change',
            method: "POST",
            data: { "openId": this.data.openId, "productId": resultArr[index].id, "number": resultArr[index].initNum },
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
        let index = e.currentTarget.dataset.index;
        let resultArr = this.data.goods;
        if (resultArr[index].initNum == resultArr[index].stock) {
            resultArr[index].initNum = resultArr[index].stock;
        } else {
            resultArr[index].initNum = resultArr[index].initNum + 1;
        };
        this.setData({
            goods: resultArr
        });
        buttonFlag = false;
        wx.request({
            url: 'https://cloudvip.vip/sell/cart/change',
            method: "POST",
            data: { "openId": this.data.openId, "productId": resultArr[index].id, "number": resultArr[index].initNum },
            success: res => {
                if (res.data.code === 0) {
                    buttonFlag = true;
                    this.inquiryPrice()
                }
            }
        })
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

    /*****显示购物车******/
    toggleCard() {
        let cardSwitchS = this.data.cardSwitch
        this.setData({
            cardSwitch: !cardSwitchS
        });
        if (this.data.cardSwitch){
    
            wx.request({
                url: 'https://cloudvip.vip/sell/cart/list',
                method:"POST",
                data:{"openId":this.data.openId},
                success:res =>{
                    console.log(res.data)
                }
            })
        }

    },
    /******关闭购物车*****/
    clooseCard() {
        this.setData({
            cardSwitch: false
        })
    },

    /****关闭公告模态框*****/
    clooseAffiche() {
        this.setData({
            afficheSwicth: false,
            afficheSwicthOne: false,
            afficheSwicthTwo: false
        })
    },
    /****打开公告模态框***/
    openAfficheOne() {
        this.setData({
            afficheSwicth: true,
            afficheSwicthOne: true
        })
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
            afficheSwicth: true,
            afficheSwicthTwo: true
        })
    }
})
