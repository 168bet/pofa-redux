const common = {
  bs64Decode: function (base64) {
    return Buffer.from(base64, 'base64').toString()
  }
}
export default common
