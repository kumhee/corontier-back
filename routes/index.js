const express = require('express');
const router = express.Router();
const axios = require('axios'); // axios를 포함합니다.
const jwt = require('jsonwebtoken');
var db = require('../db');
// ... 나머지 코드

const KAKAO_OAUTH_TOKEN_API_URL = "https://kauth.kakao.com/oauth/token";
const KAKAO_GRANT_TYPE = "authorization_code";
const KAKAO_CLIENT_ID = "edb2e3648fa374acbe7be705a5474a8a"; // 대소문자 주의!
const KAKAO_REDIRECT_URI = "http://localhost:5000/kakao/code"; // 변수명 수정

// 기본 페이지 라우트
router.get('/', function(req, res) {
    res.send('<h1>Welcome!</h1>');
});

router.get('/kakao/code', async function (req, res) {
  const code = req.query.code; // 요청에서 인증 코드 가져오기
  try {
    console.log("시도중...");
    const response = await axios.post(KAKAO_OAUTH_TOKEN_API_URL, {
      grant_type: KAKAO_GRANT_TYPE,
      client_id: KAKAO_CLIENT_ID,
      redirect_uri: KAKAO_REDIRECT_URI,
      code: code,
    }, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
    });
    console.log("----------------------토큰임--------------");
    console.log(response.data['access_token']);
    console.log(response.data['id_token']);

    // 액세스 토큰 출력
    const token = response.data['id_token'];
    
    try {
      const decoded = jwt.decode(token);
      console.log(decoded);

      const uid = decoded.email;
      const sql = 'select * from users where email=?';
      db.get().query(sql, [uid], function (err, rows) {
           if(rows.length > 0) {   //아이디있을시
                
                 res.redirect('http://localhost:3000');
           }else{

            const email = decoded.email;
            const nickname = decoded.nickname;
            const password = decoded.sub;
            const sql2 = 'insert into users (email, nickname, password) values (?,?,?)';
            db.get().query(sql2, [email,nickname,password], function (err, rows) {
              res.redirect('http://localhost:3000');
/*
토큰 기반 인증 사용 (예: JWT)
서버에서 JWT 토큰을 생성하고 이를 클라이언트로 전송합니다. 클라이언트는 이 토큰을 세션 스토리지에 저장하고, 이후 요청에 토큰을 사용하여 인증을 수행합니다.

javascript
Copy code
// 서버 측
const token = jwt.sign({ user_id: userId }, 'yourSecret');
res.json({ token });

// 클라이언트 측
const response = await axios.post('/your-server-endpoint', { ... });
sessionStorage.setItem('authToken', response.data.token);


*/
            })
          
      }})
                




    
    } catch (err) {
      console.error('JWT 해석 중 오류 발생:', err);
    }

  

  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString()); // 오류 응답
  }
});

module.exports = router;
