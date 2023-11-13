var express = require('express');
var router = express.Router();
var db = require('../db');

//태그 list.json
//localhost:5000/project/taglist.json?tag_type_id=3
router.get('/taglist.json', function (req, res) { 
    const tag_type_id = req.query.tag_type_id;
    const sql = 'select * from tags where tag_type_id=?';
    db.get().query(sql, [tag_type_id], function (err, rows) {
        if (err) console.log('.........', err);
        res.send(rows);
    });
});

//게시글 list.json
//localhost:5000/project/postlist.json?menu=1
router.get('/postlist.json', function (req, res) { 
    const menu = req.query.menu;
    const sql = 'select * from posts where menu=?';
    db.get().query(sql, [menu], function (err, rows) {
        if (err) console.log('.........', err);
        res.send(rows);
    });
});

//프로젝트글 list.json
//localhost:5000/project/projectlist.json?menu=1
router.get('/projectlist.json', function (req, res) { 
    const menu = req.query.menu;
    const sql = 'SELECT po.*, pr.* FROM posts po left join projects pr on po.post_id = pr.post_id where po.menu=?';
    db.get().query(sql, [menu], function (err, rows) {
        if (err) console.log('.........', err);
        res.send(rows);
    });
});


//프로젝트글 한개씩 가져옴
//localhost:5000/project/projectpick.json?post_id=2
router.get('/projectpick.json', function (req, res) { 
    const post_id = req.query.post_id;
    const sql = 'SELECT po.*, pr.*, u.nickname FROM posts po inner join projects pr on po.post_id = pr.post_id inner join users u on po.user_id = u.user_id where po.menu = 1 and po.post_id = ?';
    db.get().query(sql, [post_id], function (err, rows) {
        if (err) console.log('.........', err);
        res.send(rows[0]);
    });
});

//프로시저 사용해보자
//localhost:5000/project/prcedures?post_id=240&page=1&size=9
router.get('/prcedures', function (req, res) { 
    const post_id = req.query.post_id;
    const page = req.query.page;
    const size = req.query.size;
    const sql = 'call project_list(?, ?, ?)';
    db.get().query(sql, [post_id, page, size], function (err, rows) {
        if (err) console.log('.........', err);
        res.send({
            listAll: rows[0],
            listOne: rows[1][0],
            total: rows[2][0].total
        });
    });
});

//댓글 list.json
//localhost:5000/project/commentslist.json?post_id=72
router.get('/commentslist.json', function (req, res) {
    const post_id = req.query.post_id;
    const sql = 'call project_comments_list(?)';
    db.get().query(sql, [post_id], function (err, rows) {
        if (err) console.log('.........', err);
        res.send(rows[0]);
    });
});

module.exports = router;