
const express = require('express');
const fs = require('fs');
const app = express();
const cssDirectory = 'prototype-core/public/css/css-overrides'
const baseDirectory = 'prototype-core/public/'
const path = require('path')

app.get('/css-files', function (request, response) {
  response.json(fs.readdirSync(cssDirectory).filter(function (name) {
    return name.match(/\.css$/)
  }).reduce(function (dict, name) {
    dict[name] = fs.readFileSync(path.join(cssDirectory, name)).toString('utf8')
    return dict
  }, {}))
})
app.use(express.static(baseDirectory))

app.listen(3050, function () {
  console.log('Open http://localhost:3050/ to get rolling')
})
