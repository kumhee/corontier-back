const express = require('express');
const router = express.Router();
const axios = require('axios'); // axios를 포함합니다.
var db = require('../db');

router.get("/list.json", function (req, res) {
    const sql = 'select post_id, title, content, user_id, created_at, view_cnt from posts where menu=7';
    db.get().query(sql, function (err, rows) {
       //console.log("작동?1")
        res.send(rows)
    })
});


router.get("/tipinfo.json", function (req, res) {
    const sql = 'SELECT post_id, title, content, user_id, created_at, view_cnt FROM posts WHERE post_id = ?';

    const post_id = req.query.post_id;
    console.log(req.query)
    console.log(post_id)
    db.get().query(sql, [post_id], function (err, rows) {
      // console.log("작동?2")
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



router.get("/getCommentLikeCount.json", function (req, res) {
    const sql = 'SELECT c.comment_id, COUNT(ul.like_id) AS like_count FROM comments c LEFT JOIN user_likes ul ON c.comment_id = ul.comment_id GROUP BY c.comment_id';
    db.get().query(sql, function (err, rows) {
        if (err) {
            console.error("SQL error:", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.send(rows);
        }
    });
});



router.post('/likeinsert', function(req, res){
    const user_id=req.body.user_id;
    const comment_id=req.body.comment_id;
   
    console.log(user_id,comment_id)
    const sql='insert into user_likes(user_id, comment_id) values(?,?)';
    db.get().query(sql, [user_id, comment_id], function(err){
        if(err){
            res.send('0');
        }else{
            res.send('1');
        }
    })
});



router.post('/likedelete', function(req, res){
    const user_id = req.body.user_id;
    const comment_id = req.body.comment_id;
   
    console.log(user_id, comment_id);

    const sql = 'DELETE FROM user_likes WHERE user_id = ? AND comment_id = ?';
    db.get().query(sql, [user_id, comment_id], function(err){
        if(err){
            console.error(err); // 에러 로깅
            res.send('0');
        }else{
            res.send('1');
        }
    });
});


router.get("/getPostLikeCount.json", function (req, res) {
   // console.log("조회중?");

    const sql = 'SELECT p.post_id, COUNT(ul.scrap_id) AS scr_count FROM posts p LEFT JOIN scraps ul ON p.post_id = ul.post_id GROUP BY p.post_id';
    db.get().query(sql, function (err, rows) {
        if (err) {
            console.error("SQL error:", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.send(rows);
        }
    });
});


router.post('/postlikeinsert', function(req, res){
    const user_id=req.body.user_id;
    const post_id=req.body.post_id;
   
    console.log(user_id,post_id)
    const sql='insert into scraps(user_id, post_id) values(?,?)';
    db.get().query(sql, [user_id, post_id], function(err){
        if(err){
            res.send('0');
        }else{
            res.send('1');
        }
    })
});



router.post('/postlikedelete', function(req, res){
    const user_id = req.body.user_id;
    const post_id = req.body.post_id;
   
    console.log(user_id, post_id);

    const sql = 'DELETE FROM scraps WHERE user_id = ? AND post_id = ?';
    db.get().query(sql, [user_id, post_id], function(err){
        if(err){
            console.error(err); // 에러 로깅
            res.send('0');
        }else{
            res.send('1');
        }
    });
});







router.get("/getContestSCRCount.json", function (req, res) {
    //console.log("조회중?");

    const sql = 'SELECT c.contest_id, COUNT(ul.scrap_id) AS scr_count FROM contests c LEFT JOIN scraps ul ON c.contest_id = ul.contest_id GROUP BY c.contest_id';

    db.get().query(sql, function (err, rows) {
        if (err) {
            console.error("SQL error:", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.send(rows);
        }
    });
});




router.post("/allpostinsert", function (req, res) {
   
    const menu = req.body.menu;
    const title = req.body.title;
    const content = req.body.content;
    const user_id = req.body.user_id;
    console.log(menu,title,content,user_id);

    const sql='insert into posts(menu, title, content, user_id) values(?,?,?,?)';

    db.get().query(sql, [menu, title,content,user_id], function (err, rows) {
        if(err){
            console.error(err); // 에러 로깅
            res.send('0');
        }else{
            res.send('1');
        }
    });
});










module.exports = router;
