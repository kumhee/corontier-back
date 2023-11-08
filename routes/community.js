var express = require('express');
var router = express.Router();
var db = require('../db');

// 공지사항 목록
router.get("/list.json", function (req, res) {
    const sql = 'select post_id, title, content, user_id, created_at, view_cnt from posts where menu=2';
    db.get().query(sql, function (err, rows) {
        res.send(rows)
    })
});

// 공지사항 등록
router.post('/insert', function (req, res) {
//     const post_id = req.body.post_id;
//     const menu = req.body.menu;
//     const title = req.body.title;
//     const content = req.body.content;
//     // const updated_at= req.body.updated_at;
//     const user_id = req.body.user_id;
//     const sql = 'insert into posts(post_id, menu, title, content, user_id) values(?,?,?,?,?)';
//     db.get().query(sql,[post_id, menu, title, content, updated_at, user_id], function(err){
//         if(err){
//             res.send('0');
//         }else{
//             res.send('1');
//         }
//     })
})

module.exports = router;
