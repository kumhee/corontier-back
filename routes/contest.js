const express = require('express');
const router = express.Router();
const axios = require('axios'); // axios를 포함합니다.
var db = require('../db');

router.get("/list.json", function (req, res) {
    const sql = 'select post_id, title, content, user_id, created_at, view_cnt from posts where menu=7';
    db.get().query(sql, function (err, rows) {
       console.log("작동?1")
        res.send(rows)
    })
});


router.get("/tipinfo.json", function (req, res) {
    const sql = 'SELECT post_id, title, content, user_id, created_at, view_cnt FROM posts WHERE post_id = ?';

    const post_id = req.query.post_id;
    console.log(req.query)
    console.log(post_id)
    db.get().query(sql, [post_id], function (err, rows) {
       console.log("작동?2")
       console.log(rows[0])
        res.send(rows[0])
    })
});



router.get("/reviewlist.json", function (req, res) {
    const sql = 'select post_id, title, content, user_id, created_at, view_cnt from posts where menu=8';
    db.get().query(sql, function (err, rows) {
     
        res.send(rows);
    })
});


router.get("/coments.json", function (req, res) {
    const sql = 'select * from comments where post_id =?';
    const post_id = req.query.post_id;
    db.get().query(sql,[post_id], function (err, rows) {
        console.log(rows)
        res.send(rows)
    })
});



router.post('/insert', function(req, res){
    const user_id=req.body.user_id;
    const post_id=req.body.post_id;
    const content=req.body.contents;
    console.log(user_id,post_id,content)
    const sql='insert into comments(user_id, post_id,content) values(?,?,?)';
    db.get().query(sql, [user_id, post_id, content], function(err){
        if(err){
            res.send('0');
        }else{
            res.send('1');
        }
    })
});

//리뷰삭제
router.post('/delete', function(req, res){
    const comment_id=req.body.comment_id;
    const sql='delete from comments where comment_id=?';
    db.get().query(sql, [comment_id], function(err){
        if(err){
            res.send('0');
        }else{
            res.send('1');
        }
    })
});













module.exports = router;
