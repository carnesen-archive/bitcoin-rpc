'use strict';

var express = require('express');
var router = express.Router();
var async = require('async');

var makeRouter = function(opts, bd, db) {

  var getStatus = function(callback) {
    async.parallel(
      {
        bitcoind: bd.getStatus.bind(bd),
        database: db.getStatus.bind(db)
      },
      callback)
  };

  router.get('/',
    function(req, res, next) {
      getStatus(function(err, ret) {
        if(err) {
          res.status(503);
          res.send({error: err.message, result: ret});
        }
        else {
          ret.app = opts;
          res.send(ret);
        }
      });
    });
  return router;
};


module.exports = makeRouter;
