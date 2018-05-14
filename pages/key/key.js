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
        keyTitle: "Key列表",
        keyList: [],
        openId: "",
        orderKong: false,
        KongSrc: `${imageUrl}/no_data.png`
    },



    /*邮箱验证函数*/
    verify(e) {
        let index = e.currentTarget.dataset.item;
        let arr = this.data.keyList;
        arr[index].email = e.detail.value;
        arr[index].Edit = false;
        let reg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
        if (!reg.test(arr[index].email)) {
            arr[index].emailSwitch = true;
        } else {
            arr[index].emailSwitch = false;
        };
        this.setData({
            keyList: arr
        })
    },
    /**输入框输入的值**/
    getAppId(e) {
        let index = e.currentTarget.dataset.item;
        let arr = this.data.keyList;
        arr[index].appId = e.detail.value;
        arr[index].Edit = false;
        this.setData({
            keyList: arr
        })
    },
    getSecret(e) {
        let index = e.currentTarget.dataset.item;
        let arr = this.data.keyList;
        arr[index].secret = e.detail.value;
        this.setData({
            keyList: arr
        })
    },
    /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: 'key'
        })
        let that = this;
        /********获取key列表*****/
        openIdPromise.then(res => {
            that.setData({
                openId: res
            });
        
            dataJson.getKeys(res).then(res => {
                let arr = res.data;
                arr.map((item) => {
                    item.openSwitch = false;
                    item.Edit = false;
                    item.onceSwitch = true;
                    item.seretSwitch = true;
                    if (item.appId && item.email) {
                        item.editFlag = 0;
                        item.onceSwitch = false;
                        item.seretSwitch = false
                    }
                });
                that.setData({
                    keyList: arr
                })
            })
        })

    },
    /***打开/关闭详情页的开关****/
    openKeyList(e) {
        let index = e.currentTarget.dataset.item;
        let arr = this.data.keyList;
        arr[index].openSwitch = !arr[index].openSwitch;
        this.setData({
            keyList: arr
        })
    },

    /****保存数据*****/
    saveData(e) {
        let index = e.currentTarget.dataset.item;
        let arr = this.data.keyList;
        if (!arr[index].appId || !arr[index].email) {
            arr[index].Edit = true;
            this.setData({
                keyList: arr
            });
        } else {
            wx.showLoading({
                title: '保存中',
            })
            console.log(this.data.openId);
            wx.request({
                url: `${baseUrl}/sell/key/save`,
                method: "POST",
                data: {
                    "openId": this.data.openId, "key": arr[index].key, "appId": arr[index].appId, "secret": arr[index].secret, "email": arr[index].email
                },
                success: res => {
                
                    if (res.data.code == 0) {
                        arr[index].editFlag = 0;
                        arr[index].onceSwitch = false;
                        arr[index].seretSwitch = false;
                        this.setData({
                            keyList: arr
                        });
                        wx.hideLoading();
                        wx.showToast({
                            title: "保存成功",
                            type: "success"
                        })
                    } else {
                        wx.showToast({
                            type: "none",
                            title: "保存失败"
                        })
                    }
                }
            })
        }

    }
})