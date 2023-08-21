const { redirect } = require('react-router-dom');

module.exports = function(app){
    const user = require('./authController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.post('/api/verification/send-verification-email', user.send_verification_email);
    app.get('/api/verification/verify', user.verify);
///////////////////////////////////////////////////////////////////////


    // 0. 테스트 API
    // app.get('/app/test', user.getTest)

    // // 1. 유저 생성 (회원가입) API
    app.post('/app/users', user.postUsers);

    /////////////////////////////////////회원가입
    app.post('/api/signup/accountCheck', user.accountCheckTest);
    app.post('/api/signup/nicknameCheck', user.nicknameCheckTest);
    app.post('/api/signup/emailCheck', user.emailCheckTest);
    app.post('/api/signup', user.register);
    
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

app.get('/api/auth/discord', user.tryDiscord)
app.get('/api/auth/discord/callback', user.callbackDiscord);

//작성자 : 류지원
//디스코드, 라이엇 인증 API

app.post('/api/verification/send-verification-school-email', user.send_verification_school_email);
app.get('/api/verification/verify_school', user.verify_school);



// // Riot Games API Key
// const RIOT_API_KEY = 'YOUR_RIOT_API_KEY';

// // 라이엇 계정 인증 API 엔드포인트
// const summonerName = 'SummonerName'; // 라이엇 계정명

// const apiUrl = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`;

// // API 호출
// axios.get(apiUrl, {
//   headers: {
//     'X-Riot-Token': RIOT_API_KEY
//   }
// })
// .then(response => {
//   const summonerData = response.data;
//   console.log(summonerData);
// })
// .catch(error => {
//   console.error('Error:', error);
// });



};
 





// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API