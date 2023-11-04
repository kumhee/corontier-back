var express = require('express');
var router = express.Router();
var db = require('../db');

// 문제 list.json
router.get('/list.json', function(req, res) {
    const page = req.query.page;
    const size = req.query.size;
    const sql = 'call problem_list(?, ?)';
    db.get().query(sql, [page, size], function(err, rows) {
        res.send({list:rows[0]});
    });
});

// 문제 풀이 페이지
router.get('/:problem_id', function(req, res) {
    const problem_id = req.params.problem_id;
    const sql = 'select * from problems where problem_id = ?';
    db.get().query(sql, [problem_id], function(err, rows) {
        res.send(rows[0]);
    });    
});

module.exports = router;
