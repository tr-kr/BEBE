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

    //app.post('/app/users', user.postUsers);

    /////////////////////////////////////회원가입
    //app.post('/api/signup/accountCheck', user.accountCheckTest);
    //app.post('/api/signup/nicknameCheck', user.nicknameCheckTest);
    /**
 * @swagger
 * tags:
 *   name: 회원가입
 *   description: 사용자 회원가입과 관련된 API
 * 
 * /api/signup/emailCheck:
 *   post:
 *     tags:
 *       - 회원가입
 *     summary: 이메일 중복 확인
 *     description: 입력한 이메일이 이미 등록되어 있는지 확인합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: example@gmail.com
 *     responses:
 *       200:
 *         description: 이메일 중복 확인 결과에 따른 응답입니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: 요청 오류.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
    app.post('/api/signup/emailCheck', user.emailCheckTest);

    /**
 * @swagger
 * tags:
 *   name: 회원가입
 *   description: 사용자 회원가입과 관련된 API
 * 
 * /api/signup:
 *   post:
 *     tags:
 *       - 회원가입
 *     summary: 사용자 회원가입
 *     description: 사용자의 회원가입을 처리합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               nickname:
 *                 type: string
 *               birth:
 *                 type: string
 *             example:
 *               email: example@gmail.com
 *               password: examplepassword
 *               name: John Doe
 *               nickname: JohnDoe
 *               birth: 1990-01-01
 *     responses:
 *       200:
 *         description: 회원가입 성공 후 생성된 사용자 ID와 성공 메시지가 포함된 응답입니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *       400:
 *         description: 요청 오류.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
    app.post('/api/signup', user.register);
    
    // 2. 유저 조회 API (+ 검색)
 //   app.get('/app/users',user.getUsers); 



    // TODO: After 로그인 인증 방법 (JWT)
    // 로그인 하기 API (JWT 생성)
    app.post('/app/login', user.login);

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers);
////////////////////////////////////////////////////////////////
    //작성자 : 류지원
    //디스코드 인증 API
/**
 * @swagger
 * tags:
 *   name: 인증
 *   description: 사용자 마이페이지 정보 조회 및 수정과 관련된 API
 * 
 * /api/auth/discord:
*     tags:
 *       - 인증
 *     summary: Discord 로그인 시도
 *     description: Discord 로그인을 시도합니다.
 *     responses:
 *       302:
 *         description: Discord 로그인 페이지로 리다이렉트합니다.
 */
    app.get('/api/auth/discord', user.tryDiscord);

    /**
 * @swagger
 * tags:
 *   name: 인증
 *   description: 사용자 마이페이지 정보 조회 및 수정과 관련된 API
 * 
 * /api/auth/discord/callback:
 *   get:
*     tags:
 *       - 인증
 *     summary: Discord 콜백 처리
 *     description: Discord 로그인 후 콜백을 처리합니다.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Discord 콜백 코드입니다.
 *     responses:
 *       200:
 *         description: Discord 콜백 처리 결과와 성공 메시지가 포함된 응답입니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 *       400:
 *         description: 요청 오류.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

    app.get('/api/auth/discord/callback', user.callbackDiscord);

    /**
 * @swagger
 * tags:
 *   name: 인증
 *   description: 사용자 인증과 관련된 API
 * 
 * /api/auth/discord/update:
 *   post:
*     tags:
 *       - 인증
 *     summary: Discord 정보 업데이트
 *     description: 사용자의 Discord 정보를 업데이트합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               discord:
 *                 type: string
 *             example:
 *               id: 1
 *               discord: DiscordUser#1234
 *     responses:
 *       200:
 *         description: Discord 정보 업데이트 성공 후 성공 메시지가 포함된 응답입니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: 요청 오류.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
    app.post('/api/auth/discord/update', user.updateDiscord);

    //작성자 : 류지원
    // 라이엇 인증 API

/**
 * @swagger
 * tags:
 *   name: 인증
 *   description: 사용자 인증과 관련된 API
 * 
 * /api/verification/send-verification-school-email:
 *   post:
*     tags:
 *       - 인증
 *     summary: 학교 이메일 인증 이메일 전송
 *     description: 사용자의 학교 이메일로 인증 이메일을 전송합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               email:
 *                 type: string
 *             example:
 *               id: 1
 *               email: example@example.com
 *     responses:
 *       200:
 *         description: 학교 이메일 인증 이메일 전송 성공 후 성공 메시지가 포함된 응답입니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: 요청 오류.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

    app.post('/api/verification/send-verification-school-email', user.send_verification_school_email);
    
    /**
 * @swagger
 * tags:
 *   name: 인증
 *   description: 사용자 인증과 관련된 API
 * 
 * /api/verification/verify_school:
 *   get:
 *     tags:
 *       - 인증
 *     summary: 학교 이메일 인증 확인
 *     description: 학교 이메일 인증을 확인하고 본인 확인을 완료합니다.
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: 학교 이메일 인증 토큰입니다.
 *     responses:
 *       200:
 *         description: 학교 이메일 인증 확인 성공 후 성공 메시지가 포함된 응답입니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: 요청 오류.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
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