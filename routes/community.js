var express = require('express');
var router = express.Router();
var db = require('../db');

// 공지사항 목록
router.get("/noticelist.json", function (req, res) {
    const sql = 'SELECT p.*, u.nickname, date_format(p.created_at, "%Y.%m.%d %T") fmtdate FROM posts p inner join users u on p.user_id = u.user_id where p.menu = 2;';
    db.get().query(sql, function (err, rows) {
        res.send(rows)
    })
});

// 공지사항 등록
router.post('/insert', function (req, res) {
    const menu = req.body.menu;
    const title = req.body.title;
    const content = req.body.content;
    const user_id = req.body.user_id;
    const sql = 'insert into posts(menu, title, content, user_id) values(?,?,?,?)';
    db.get().query(sql, [menu, title, content, user_id], function (err) {
        if (err) {
            res.send('0');
        } else {
            res.send('1');
        }
    })
})

// 공지사항 정보
router.get('/notice/:post_id',function(req, res){ //localhost:5000/community/notice/1
    const post_id =req.params.post_id;
    const sql='select * from posts where post_id=?';
    db.get().query(sql, [post_id], function(err, rows){
        res.send(rows);
        console.log(rows);
    });
});


//공지사항 수정
router.post('/update', function (req, res) {
    const title = req.body.title;
    const content = req.body.content;
    const view_cnt = req.body.view_cnt;
    const post_id = req.body.post_id;
    const sql = 'update posts set title=?, content=?, created_at = now(), view_cnt=? where post_id=?';
    db.get().query(sql, [title, content, view_cnt, post_id], function (err) {
        if (err) {
            res.send('0');
        } else {
            res.send('1');
        }
    });
});

//공지사항 삭제
router.post('/delete', function (req, res) {
    const post_id = req.body.post_id;
    const sql = 'delete from posts where post_id=?';
    db.get().query(sql, [post_id], function (err) {
        if (err) {
            res.send('0');
        } else {
            res.send('1');
        }
    });
});

// 개발자 라운지 목록
router.get('/loungelist.json', function(req, res){
    const sql='SELECT p.*, u.nickname, u.profile_image, c.comment_id, date_format(p.created_at, "%Y.%m.%d %T") fmtdate FROM posts p inner join users u on p.user_id = u.user_id  inner join comments c on p.user_id = c.user_id where p.menu = 3;'
    db.get().query(sql,function(err, rows){
        res.send(rows);
    })
});
module.exports = router;
