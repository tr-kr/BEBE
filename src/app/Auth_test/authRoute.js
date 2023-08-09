module.exports = function(app){
    const user = require('./authController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    // 0. 테스트 API
    // app.get('/app/test', user.getTest)

    // // 1. 유저 생성 (회원가입) API
    // app.post('/app/users', user.postUsers);

    
    // 2. 유저 조회 API (+ 검색)
    app.get('/app/users',user.getUsers); 



    // TODO: After 로그인 인증 방법 (JWT)
    // 로그인 하기 API (JWT 생성)
    app.post('/app/login', user.login);

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers);
////////////////////////////////////////////////////////////////
//작성자 : 류지원
//디스코드, 라이엇 인증 API

/*     app.get('/api/auth/discord', user.tryAuthDiscord);

    //계정인증시 콜백
    app.get('/api/auth/discord/success', user.authDiscord); */

const axios = require('axios');
const CLIENT_ID = '1138439231073693736';
const CLIENT_SECRET = '4f34a94c10adfd93b336fd0265fc8157ea9421b6a35c911e2559fa0f6c9c15d1';
const REDIRECT_URI = 'http://localhost:3000/api/auth/discord/success';


app.get('/api/auth/discord', (req, res) => {
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`);
});

app.get('/api/auth/discord/success', async (req, res) => {
  const code = req.query.code;

  try {
    console.log(1);

    const data =new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
    }).toString();
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    console.log(4);
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', data, { headers });

    
      console.log(tokenResponse);
    //const accessToken = tokenResponse.data.access_token;
    const accessToken = tokenResponse.data.access_token;
      console.log(2);


     const userResponse = await axios.get('/users/@me', {
       headers: {
         Authorization: `Bearer ${accessToken}`,
       },
     });

     const user = userResponse.data;
     // 여기서 user 정보를 활용하여 사용자 인증 및 처리 로직을 진행합니다.

     res.send(`Hello, ${user.username}#${user.discriminator}!`);
  } catch (error) {
    console.error('Error:', error.message);
    res.send('An error occurred.');
  }
});
};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API