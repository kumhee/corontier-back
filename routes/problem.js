var express = require('express');
var router = express.Router();
var db = require('../db');

// 문제등록 라우터 (Question)
// router.post('/question/insert', function(req, res) {
//     const problem_id = req.body.problem_id; 
//     const tag_id = req.body.tag_id;
//     const size = req.body.size ? req.body.size : 5; 
//     const sql = 'insert into problems(problem_id, tag_id) values (?, ?)'; 
//     db.get().query(sql, [problem_id, tag_id], function(err, result){
//         if (err) {
//             console.log("..............", err);
//         } else {
//             res.send({  });
//         }
//     });
// });



// 문제 list.json
router.get('/list.json', function (req, res) {
    const page = req.query.page;
    const size = req.query.size;
    const sql = 'call problem_list(?, ?)';
    db.get().query(sql, [page, size], function (err, rows) {
        res.send({ list: rows[0] });
    });
});

// 문제 풀이 페이지
router.get('/:problem_id', function (req, res) {
    const problem_id = req.params.problem_id;
    const sql = 'select * from problems where problem_id = ?';
    db.get().query(sql, [problem_id], function (err, rows) {
        res.send(rows[0]);
    });
});

const { spawn } = require('child_process');
const { exec } = require('child_process');
const { execFile } = require('child_process');

// 입력받은 코드 실행
router.post('/execute', function (req, res) {
    const { code, language } = req.body;
    let executionResult = '';


    const handlePythonExecution = () => {
        const pythonProcess = spawn('python', ['-c', code]);

        pythonProcess.stdout.on('data', (data) => {
            executionResult += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            executionResult += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                executionResult = executionResult.replace(/\r?\n|\r/g, "");
                console.log('파이썬 입력코드 실행 결과값', executionResult);
                res.send(executionResult);
            } else {
                const errorMessage = `Execution failed with code ${code}`;
                console.log(errorMessage);
                res.send(errorMessage);
            }
        });
    };

    const handleJavascriptExecution = () => {
        try {
            const result = eval(code);
            executionResult = result.toString();
            console.log('자바스크립트 입력코드 실행 결과값 :', executionResult);
            res.send(executionResult);
        } catch (error) {
            executionResult = `Error: ${error.message}`;
            res.send(executionResult);
        }
    };

    switch (language) {
        case 'python':
            handlePythonExecution();
            break;
        case 'javascript':
            handleJavascriptExecution();
            break;
        default:
            const errorMessage = 'Unsupported language';
            console.log(errorMessage);
            res.send(errorMessage);
    }
});


module.exports = router;