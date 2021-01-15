var express = require('express');
var router = express.Router();

const indexMainFunction = require('./index.service.js');

router.post('/', indexMainFunction);

module.exports = router;
