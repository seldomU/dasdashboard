'use strict';
const { Router } = require("express");

module.exports = function (settings, state) {

    const router = new Router();

    router.use('/board', require('./api/board.js')(settings, state));
    router.use('/system', require('./api/system.js')(settings, state));
    return router;
}