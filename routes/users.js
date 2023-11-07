var express = require('express');
var router = express.Router();
var db = require('../db');
var multer = require('multer');
const fs = require('fs')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//특정사용자정보읽기 REST API sessionStorage에 어떤컬럼넣을지에 따라 user_id위치 해당컬럼명으로 변경해야함
router.get('/read/:user_id',function(req,res){
  const user_id = req.params.user_id;
  const sql = "select * from users where user_id = ?";
  db.get().query(sql,[user_id],function(err,rows){
    if(err) console.log(err);
    res.send(rows[0]);
  })
});  
//사용자정보 수정
router.post('/update',function(req,res){
  const user_id = req.body.user_id;
  const password = req.body.password;
  const email = req.body.email;
  const nickname = req.body.nickname;
  const profile_image = req.body.profile_image;

  const sql = 'update users set password = ?, email =?, nickname = ?, profile_image = ?, updated_at=now() where user_id = ? ';
  
  db.get().query(sql,[password,email,nickname,profile_image ,user_id],function(err,rows){
    if(err){
      console.log(err)
      res.send('0');
    } 
    else res.send('1');
  })
});

//profile 사진업로드함수
var upload = multer({
  storage: multer.diskStorage({
    destination:(req,file,done)=>{
      const destination = `./public/users/profile`;
      
      // 디렉토리가 없을 경우 생성.
      fs.mkdirSync(destination, { recursive: true });
      done(null, destination);
    },
    filename:(req,file,done)=>{  
      const user_id = req.query.user_id;      
      const fileName = `${user_id}_${Date.now()}.jpg`;
      done(null, fileName);
    }
  })
});
//profile이미지 업로드
router.post('/update/profile',upload.single('file'),function(req,res){
  const filename = '/users/profile/'+req.file.filename;
  const user_id = req.query.user_id;
  
  const sql = 'update users set profile_image =? where user_id = ?';
  db.get().query(sql,[filename,user_id],function(err){
    if(err) res.send('0')
    else res.send('1')
  });
});



module.exports = router;
