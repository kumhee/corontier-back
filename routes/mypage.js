//mypage사용
var express = require('express');
var router = express.Router();
var db = require('../db');

//post category별로 select
router.get('/posts.list',function(req,res){
  const user_id = parseInt(req.query.user_id) 
  const menu = req.query.menu
  const size = parseInt(req.query.size) 
  const page = parseInt(req.query.page) 

  const start = (page-1)*size;
  let menuPattern = menu==='0' ||menu==='-1'?`%%`:`%${menu}%`;

  const sql = "select *,date_format(created_at,'%Y-%m-%d') as date,date_format(updated_at,'%Y-%m-%d') as newdate, (select count(*) from posts where user_id = ?) as total from posts where user_id = ? and menu like ? order by updated_at limit ?,? "

  db.get().query(sql,[user_id,user_id,menuPattern,start,size],function(err,rows){
    if (err) {
      console.log("에러: ", err);
      res.status(500).send({ error: "데이터를 불러오는 중 오류가 발생했습니다." });
    } else if (rows.length === 0) {
      console.log(rows);
      res.send({ 'list': rows, 'total': 0 });
    } else {
      res.send({ 'list': rows, 'total': rows[0].total });
    }
    }) 
});

module.exports = router;