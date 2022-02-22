const express = require('express');
const router = express.Router();
const exceljs = require('exceljs')
const mysql = require('mysql')
// const {init, query} = require('../components/mysql');
// console.log('env',process.env)
//엑셀 다운로드 테스트
router.get('/test/excel', async function(req, res) {
  const poolCluster = mysql.createPoolCluster()
  const config = {
    host: '',
    user: '',
    password: '',
    database: ''
  }
  poolCluster.add('MASTER', {...config})
  const options = {
    stream: res,
    useStyles: true,
    useSharedStrings: false,
  }
  let query_string = 'SELECT * FROM exampleTest limit 1000000';
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader("Content-Disposition", "attachment; filename=example.xlsx");

  const workbook = new exceljs.stream.xlsx.WorkbookWriter(options);
  // workbook.stream.pipe(res);
  // highWaterMark는 데이터 가져오는 개수입니다
  const str = poolCluster.of('MASTER').query(query_string).stream({highWaterMark: 1000});

  // sheet 이름
  const sheet = workbook.addWorksheet('sheet2');
  sheet.columns = [
    {header:'1', key: 'pp', width: 15, style: {font: {name: 'Arial', size: 12, bold: true}}},
    {header:'2', key: 'part', width: 25, style: {font: {name: 'Arial', size: 12, bold: true}} },
    {header:'3', key: 'plav', width: 25, style: {font: {name: 'Arial', size: 12, bold: true}} },
    {header:'4', key: 'rul', width: 25, style: {font: {name: 'Arial', size: 12, bold: true}} },
    {header:'5', key: 'date', width: 25, style: {font: {name: 'Arial', size: 12, bold: true}} },
    {header:'6', key: 'nd', width: 25, style: {font: {name: 'Arial', size: 12, bold: true}} },
    {header:'7', key: 'mark', width: 25, style: {font: {name: 'Arial', size: 12, bold: true}} },
    {header:'8', key: 'znach', width: 25, style: {font: {name: 'Arial', size: 12, bold: true}} },
    {header:'9', key: 'tol', width: 25, style: {font: {name: 'Arial', size: 12, bold: true}} },
    {header:'10', key: 'width', width: 25, style: {font: {name: 'Arial', size: 12, bold: true}} },
    {header:'11', key: 'length', width: 25, style: {font: {name: 'Arial', size: 12, bold: true}} }
];
  console.time('time start');
  str.on('data', function (d) {
    sheet.addRow(Object.values(d)).commit(); // format object if required
  });

  str.on('end', function () {
    sheet.commit();
    workbook.commit();
    console.timeEnd('time start');
    // done();
  });

  str.on('error', function (err) {
    console.log(err);
  });
  
});

module.exports = router;
