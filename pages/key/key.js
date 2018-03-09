// pages/key/key.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyTitle: "Key列表",
    keyList: [{ "key": "key1", "token": "abc", "switch": false, "emailText": "456", "emailSwitch": false }, { "key": "key1", "token": "abc", "switch": false, "emailText": "456", "emailSwitch": false }, { "key": "key1", "token": "abc", "switch": false, "emailText": "456", "emailSwitch": false }, { "key": "key1", "token": "abc", "switch": false, "emailText": "456", "emailSwitch": false }, { "key": "key1", "token": "abc", "switch": false, "emailText": "456", "emailSwitch": false }, { "key": "key1", "token": "abc", "switch": false, "emailText": "456", "emailSwitch": false }]
  },


  /*邮箱验证函数*/
  verify(e) {
    let index = e.currentTarget.dataset.item;
    let arr = this.data.keyList;
    arr[index].emailText = e.detail.value;
    let reg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
    if (!reg.test(arr[index].emailText)) {
      arr[index].emailSwitch = true;
    }else{
      arr[index].emailSwitch = false;
    }
    this.setData({
      keyList: arr
    })
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  openKeyList(e) {
    let index = e.currentTarget.dataset.item;
    let arr = this.data.keyList;
    arr[index].switch = !arr[index].switch;
    this.setData({
      keyList: arr
    })
  }
})