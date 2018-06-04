var express = require('express');
var upload=require('../api/fileupload/fileupload')
var uploadfile=require('../api/model/operation.db')
var admin=require('../api/controller/admin.controller')
var operationdb=require('../api/model/operation.db')

var router = express.Router();

/* GET home page. */
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'File Upload', message: '' });
});

// post call after browsing the file location

router.post('/', [upload.upload,admin.insertTCStoDB,operationdb.uploadTcsToDB]);
router.get('/listtcs',[admin.fetchTCSfromDB,operationdb.fetchTcsToDB ]);
router.get('/listtcs/:tcsno',[admin.fetchTCSfromDB,operationdb.fetchSpecificTcsToDB ]);

module.exports = router;
