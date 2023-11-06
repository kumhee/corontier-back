var express = require('express');
var router = express.Router();
var db = require('../db');

//태그 list.json
router.get('/taglist.json', function (req, res) { //localhost:5000/project/taglist.json?tag_type_id=3
    const tag_type_id = req.query.tag_type_id;
    const sql = 'select * from tags where tag_type_id=?';
    db.get().query(sql, [tag_type_id], function (err, rows) {
        if (err) console.log('.........', err);
        res.send(rows);
    });
});

//게시글 list.json
router.get('/postlist.json', function (req, res) { //localhost:5000/project/postlist.json?menu=1
    const menu = req.query.menu;
    const sql = 'select * from posts where menu=?';
    db.get().query(sql, [menu], function (err, rows) {
        if (err) console.log('.........', err);
        res.send(rows);
    });
});

module.exports = router;