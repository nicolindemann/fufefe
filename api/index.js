const bent = require('bent')
const lzString = require('lz-string')

module.exports = async (req, res) => {
  const body = await bent('string')(req.query.url)
  res.send(lzString.compressToUTF16(body))
}
