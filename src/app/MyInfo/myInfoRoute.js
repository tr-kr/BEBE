module.exports = function(app){
    const user = require('./myInfoController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');




    // 0. 테스트 API
    // app.get('/app/test', user.getTest)

    // // 1. 유저 생성 (회원가입) API
    // app.post('/app/users', user.postUsers);

    
    // 2. 유저 조회 API (+ 검색)
//    app.get('/app/users',user.getUsers); 



    // TODO: After 로그인 인증 방법 (JWT)
    // 로그인 하기 API (JWT 생성)
    //app.post('/app/login', user.login);

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
  //  app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)

    ///////////////////////////////////////////////////////////////
    //류지원


    //류지원
    // 3. 특정 유저 조회 API
    
/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     tags:
 *       - 마이페이지
 *     summary: 사용자 정보 조회
 *     description: 특정 사용자의 정보를 조회합니다.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 사용자의 ID입니다.
 *     responses:
 *       200:
 *         description: 사용자 정보와 성공 메시지가 포함된 응답입니다.
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
 *                     nickname:
 *                       type: string
 *                     password:
 *                       type: string
 *                     email:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                     discord_auth:
 *                       type: boolean
 *                     riot_auth:
 *                       type: boolean
 *                     school_auth:
 *                       type: boolean
 *                     played_competition:
 *                       type: boolean
 *                     played_match:
 *                       type: boolean
 *                     win:
 *                       type: integer
 *                     lose:
 *                       type: integer
 *                     birth:
 *                       type: string
 *                       format: date
 *                     emailVerified:
 *                       type: boolean
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

  //  app.get('/api/user/:userId', user.getUserById);

    /**
 * @swagger
 * /api/user/myInfo?token={token}:
 *   get:
 *     tags:
 *       - 마이페이지
 *     summary: 사용자 정보 조회
 *     description: 특정 사용자의 정보를 조회합니다.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 사용자의 token입니다.
 *     responses:
 *       200:
 *         description: 사용자 정보와 성공 메시지가 포함된 응답입니다.
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
 *                     nickname:
 *                       type: string
 *                     password:
 *                       type: string
 *                     email:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                     discord_auth:
 *                       type: boolean
 *                     riot_auth:
 *                       type: boolean
 *                     school_auth:
 *                       type: boolean
 *                     played_competition:
 *                       type: boolean
 *                     played_match:
 *                       type: boolean
 *                     win:
 *                       type: integer
 *                     lose:
 *                       type: integer
 *                     birth:
 *                       type: string
 *                       format: date
 *                     emailVerified:
 *                       type: boolean
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
    app.get('/api/user/myInfo', jwtMiddleware, user.getUserByToken);

    
/**
 * @swagger
 * /api/user/{userId}:
 *   put:
 *     tags:
 *       - 마이페이지
 *     summary: 사용자 정보 업데이트
 *     description: 사용자의 별명과 비밀번호를 업데이트합니다.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 업데이트할 사용자의 ID입니다.
 *       - in: body
 *         name: user
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nickname:
 *               type: string
 *             password:
 *               type: string
 *         description: 업데이트할 사용자 정보입니다.
 *     responses:
 *       200:
 *         description: 업데이트된 사용자 정보와 성공 메시지가 포함된 응답입니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: 내부 서버 오류입니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

    //app.put('/api/user/:userId', user.updateUser);



/**
 * @swagger
 * /api/user/myInfo?token={token}:
 *   put:
 *     tags:
 *       - 마이페이지
 *     summary: 사용자 정보 업데이트
 *     description: 사용자의 별명과 비밀번호를 업데이트합니다.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: 업데이트할 사용자의 token입니다.
 *       - in: body
 *         name: user
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nickname:
 *               type: string
 *             password:
 *               type: string
 *         description: 업데이트할 사용자 정보입니다.
 *     responses:
 *       200:
 *         description: 업데이트된 사용자 정보와 성공 메시지가 포함된 응답입니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: 내부 서버 오류입니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
    app.put('/api/user/myInfo', jwtMiddleware, user.updateUserByToken);

    // 참여한 대회 리스트 조회API
    /**
 * @swagger
 * /api/user/playList/{userId}:
 *   get:
 *     tags:
 *       - 마이페이지
 *     summary: 사용자의 참가 대회 목록 조회
 *     description: 특정 사용자가 참가한 대회 목록을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 참가 대회 목록을 조회할 사용자의 ID입니다.
 *     responses:
 *       200:
 *         description: 사용자의 참가 대회 목록과 성공 메시지가 포함된 응답입니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       competition_id:
 *                         type: integer
 *                       ranking:
 *                         type: integer
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
    app.get('/api/user/playList/:userId', user.getPlayListById);


/**
 * @swagger
    * /api/user/playList?token={token}:
    *   get:
    *     tags:
    *       - 마이페이지
    *     summary: 사용자의 참가 대회 목록 조회
    *     description: 특정 사용자가 참가한 대회 목록을 조회합니다.
    *     parameters:
    *       - in: path
    *         name: token
    *         required: true
    *         schema:
    *           type: string
    *         description: 참가 대회 목록을 조회할 사용자의 token입니다.
    *     responses:
    *       200:
    *         description: 사용자의 참가 대회 목록과 성공 메시지가 포함된 응답입니다.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message:
    *                   type: string
    *                 data:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                       competition_id:
    *                         type: integer
    *                       ranking:
    *                         type: integer
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
       app.get('/api/user/playList', jwtMiddleware, user.getPlayListByToken);
   



    // 개최한 대회 리스트 조회API
/**
 * @swagger
 * /api/user/hostList/{userId}:
 *   get:
 *     tags:
 *       - 마이페이지
 *     summary: 사용자가 개최한 대회 목록 조회
 *     description: 특정 사용자가 개최한 대회 목록을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 개최한 대회 목록을 조회할 사용자의 ID입니다.
 *     responses:
 *       200:
 *         description: 사용자가 개최한 대회 ID 목록과 성공 메시지가 포함된 응답입니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
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
    app.get('/api/user/hostList/:userId', user.getHostListById);

/**
 * @swagger
 * /api/user/hostList?token={token}:
 *   get:
 *     tags:
 *       - 마이페이지
 *     summary: 사용자가 개최한 대회 목록 조회
 *     description: 특정 사용자가 개최한 대회 목록을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: 개최한 대회 목록을 조회할 사용자의 token입니다.
 *     responses:
 *       200:
 *         description: 사용자가 개최한 대회 ID 목록과 성공 메시지가 포함된 응답입니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
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
app.get('/api/user/hostList', jwtMiddleware, user.getHostListByToken);

///////////////////////////////////////////////////////////////







};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API