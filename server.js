
var express = require('express');
var fs = require('fs');
var app = express();
var cssDirectory = 'prototype-core/public/css/css-overrides'

app.get('/css-files', function (request, response) {
  response.json(fs.readdirSync(cssDirectory).filter(function (name) {
    return name.match(/\.css$/)
  }).reduce(function (dict, name) {
    dict[name] = fs.readFileSync(cssDirectory + '/' + name).toString('utf8')
    return dict
  }, {}))
})
app.use(express.static('.'))

app.listen(3050, function () {
  console.log('Open http://localhost:3050 to get rolling')
})
