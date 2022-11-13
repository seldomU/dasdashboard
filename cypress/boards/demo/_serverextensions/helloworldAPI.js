'use strict';

module.exports = function (router) {

    router.get('/hello', (req,res) => {
        res.send("hello world")
    })
}