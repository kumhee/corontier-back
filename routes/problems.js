var express = require('express');
var router = express.Router();
var db = require('../db');

// 문제 등록
router.post('/insert', function(req, res) {
    const { problem_id, title, content, input, output, grade_id } = req.body.output;
    const sql = 'insert into problems (title, content, input, output, grade_id) value(?,?,?,?,?)';
    db.get().query(sql, [title, content, input, output, grade_id], function(err) {
        if(err) {
            res.send('0');
        } else {
            res.send('1');
        }
    });
});

module.exports = router;
