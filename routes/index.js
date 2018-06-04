var express = require('express');
var upload=require('../api/fileupload/fileupload')
var uploadfile=require('../api/model/operation.db')
var admin=require('../api/controller/admin.controller')
var operationdb=require('../api/model/operation.db')

var router = express.Router();

/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index', { title: 'File Upload', message: '' });
});

// post call after browsing the file location

router.post('/v1/admin/upload', [upload.upload,admin.insertTCStoDB,operationdb.uploadTcsToDB]);
router.get('/v1/admin/listtcs',[admin.fetchTCSfromDB,operationdb.fetchTcsToDB ]);
router.get('/v1/admin/listtcs/:tcsno',[admin.fetchTCSfromDB,operationdb.fetchSpecificTcsToDB ]);
router.post('/v1/admin/updatetcs',[admin.updateTCSfromDB,operationdb.UpdateTcsToDB ]);
router.delete('/v1/admin/del/:tcsno',[admin.deleteTCSfromDB,operationdb.deleteTcsToDB ]);

module.exports = router;
