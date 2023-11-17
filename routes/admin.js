//admin
var express = require('express');
var router = express.Router();
var db = require('../db');

//post category별로 
router.post('/posts.list', function (req, res) {
  const grade_id = req.body.grade_id ? `${req.body.grade_id}` : '%%';
  const tag_name = req.body.tag_name ? `%${req.body.tag_name}%` : '%%';
  const title = req.body.title ? `%${req.body.title}%` : '%%';
  const problem_id = req.body.problem_id ? `${req.body.problem_id}` : '%%';

  const sql = "call admin_post_list (?,?,?,?)"
  db.query(sql, [grade_id, tag_name, title, problem_id], function (err, rows) {
    if (err) {
      console.error('에러:', err);
      res.status(500).json({ error: '데이터를 불러오는 중 오류가 발생했습니다.' });
    }
    const resData = {
      result: 'success', 
      data: rows, 
    };
    res.json(resData);
  });
});

//user별 comment 가져오기
router.get('/comments.list', function (req, res) {
  const user_id = req.query.user_id;
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);
  const menu = req.query.menu

  let menuPattern = menu === '0' || menu === '-1' ? `%%` : `%${menu}%`;
  const start = (page - 1) * size;

  const sql = "select c.*,date_format(c.updated_at,'%Y-%m-%d') as fmtdate,p.title from comments c join posts p on c.post_id = p.post_id  join users u on u.user_id= c.user_id; ";
  db.get().query(sql, [user_id, menuPattern, user_id, menuPattern, start, size], function (err, rows) {
    if (err) {
      console.log("에러: ", err);
      res.status(500).send({ error: "데이터를 불러오는 중 오류가 발생했습니다." });
    } else if (rows.length === 0) {
      console.log(rows);
      res.send({ 'list': rows, 'total': 0 });
    } else {
      res.send({ 'list': rows, 'total': rows[0].total });
    }
  });
});