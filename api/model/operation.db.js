var XLSX = require('xlsx');
const fs = require('fs')
var path=require('path')
//var Promise=require('bluebird')
const mysql=require('../db/mysqldb')


var dbOperation={

    uploadTcsToDB : function(req,res,next){

        let dirpath = path.resolve(__dirname),
                indexpath = dirpath.lastIndexOf('\\') + 1,
                rootpath = dirpath.substr(0, indexpath);

var workbook = XLSX.readFile(rootpath+'/upload/uploadedfile.xlsx');
var arr = [];
workbook.SheetNames.forEach(function(ele) {
var sheet_name = ele;
var worksheet = workbook.Sheets[sheet_name];
arr.push(JSON.stringify(XLSX.utils.sheet_to_json(worksheet)));
})

console.log('Done....')

//creatae array of json data
modifyAdd = [];
var addall = arr.toString().replace(/[\r\n]+/g, " ").split('}]');;
//console.log(addall)
addall.forEach(function(el) {
modifyAdd.push((el[0] === ',' ? el.slice(1, el.length) : el) + '}]');
})
//console.log(modifyAdd)
let insertdata = [];
// array to create list of TCS persent in DB so that we can send message about updating the existing TCS
let tcsExistInDB = [];
//Iterate the whole set of data and create
let owner='Sahajahan',
datetime=new Date().toISOString().slice(0, 19).replace('T', ' '),
updater='Sandeep',
updateddate=new Date().toISOString().slice(0, 19).replace('T', ' ');

// the tcs already present in DB.here we need to query DB and get all the TCS list
let tcslistdb=[];
let tcslistnotindb=[];

mysql.query('select TESTCASE from tcs_master',(err,result,fields)=>{
    if(err){
        console.log(err)
    }
  if(!err){
    for(let i=0;i<result.length;i++){
        tcslistdb.push(result[i]['TESTCASE'])
    }
    
modifyAdd.forEach(function(ele) {
    if (ele.length > 4) {
    var sheetData = JSON.parse(ele);
    for (var key in  sheetData) {
        
    if (tcslistdb.indexOf(sheetData[key]['TestCase']) == -1) {
        let rowdata=[];
        tcslistnotindb.push(sheetData[key]['TestCase'])
        rowdata.push(sheetData[key]['TestCase'])
        rowdata.push(sheetData[key]['DataBinding'])
        rowdata.push(sheetData[key]['Functionality'])
        rowdata.push(sheetData[key]['Business flow'])
        rowdata.push(sheetData[key]['Business Rule'])
        rowdata.push(sheetData[key]['Expected Result'])
        rowdata.push(sheetData[key]['Pre-requisite'])
        rowdata.push(sheetData[key]['Interface'])
        rowdata.push(sheetData[key]['User Group'])
        rowdata.push(sheetData[key]['Version'])
        rowdata.push(owner)
        rowdata.push(datetime)
        rowdata.push(updater)
        rowdata.push(updateddate)
    insertdata.push(rowdata)
    } else {
    tcsExistInDB.push(sheetData[key]['TestCase']);
    }
    }
    }
    })
    
    
let insertstatement = 'Insert into tcs_master (`TESTCASE`,`DATABINDING`,`FUNCTIONALITY`,`BUSINESS_FLOW`,`BUSINESS_RULE`,`EXPECTED_RESULT`,`PRE_REQUISITE`,`INTERFACE`,`USER_GROUP`,`VERSION`,`CREATED_BY`,`CREATION_DTTM`,`UPDATED_BY`,`UPDATED_DTTM`) values ? ';

/// deleting the tcs

if(insertdata.length >0){
    if(tcsExistInDB.length >0){
        console.log('Below are the existing cases : ')
    console.log(tcsExistInDB)
    }
mysql.query(insertstatement,[insertdata],(err,result)=>{
    if(err)
    console.log(err)
    console.log(result)
    let message={
        "Testcase_inserted":tcslistnotindb,
        "TestcaseinDB":tcsExistInDB
    }
    res.status(200).json(message);
})
}else{
    console.log('nothing to insert. Existing data')
    console.log(tcsExistInDB)
    let message={
        "Testcase_inserted":tcslistnotindb,
        "TestcaseinDB":tcsExistInDB
    }
    res.status(200).json(message);
}

}
})
    },
    fetchTcsToDB : function(req,res){
        mysql.query('select * from tcs_master',(err,result,fields)=>{
            if(err){
                console.log(err)
            }
            res.status(200).json(result);
        })
    },
    fetchSpecificTcsToDB : function(req,res){
        let tcs_id = req.params.tcsno;
        var data = '';
        for (var i = 0; i < tcs_id.split(',').length; i++) {
            data = data + "'" + tcs_id.split(',')[i] + "',"
        }
        console.log(data.slice(0, data.length - 1))
        let query = '';
        if (tcs_id) {
            query = 'SELECT * FROM tcs_master WHERE TESTCASE IN (' + data.slice(0, data.length - 1) + ')';
        } else {
            query = 'SELECT * FROM tcs_master';
        }
        console.log(query)
        mysql.query(query, function(err, result) {
            if (err) {
                req.resultOfDB = err.stack;
                res.status(500).end();
            } else {
                res.status(200).json(result);
            }
        })
    }
}

module.exports=dbOperation;