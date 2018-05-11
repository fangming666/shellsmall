var openId = function () {
  return new Promise(function (resolve, reject) {
    wx.getStorage({
      key: 'openID',
      success: function (res) {
        resolve(res.data)
      }
    })
  })
}
module.exports = {
  openId: openId()
}