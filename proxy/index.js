module.exports = require('express')().use('*', require('html2canvas-proxy')())
