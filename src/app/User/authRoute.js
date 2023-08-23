module.exports = function (app) {
  const auth = require("./authController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  //로그인,로그아웃,회원가입,로그인 인가 light
  //app.post("/api/login", auth.login);
  //app.get("/api/logout", auth.logout);
  //app.get("/api/verify-token", jwtMiddleware, auth.verifyToken);

  //회원탈퇴 light
  //app.get("/api/deleteuser/", jwtMiddleware, auth.deleteuser);
  /**
   * @swagger
   * /api/login:
   *   post:
   *     summary: 사용자 로그인, 패스워드 체크
   *     tags:
   *       - 로그인
   *     requestBody:
   *       description: User's email and password for login
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Successful login
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 isSuccess:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     useridx:
   *                       type: integer
   *                     jwt:
   *                       type: string
   *       400:
   *         description: Bad request or wrong email/password
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 isSuccess:
   *                   type: boolean
   *                 errorMessage:
   *                   type: string
   */
  app.post("/api/login", auth.login);

  /**
   * @swagger
   * /api/deleteuser?token={token}:
   *   delete:
   *     summary: 회원탈퇴
   *     description: Use this API to delete the authenticated user's account.
   *     security:
   *       - jwtToken: []
   *     responses:
   *       200:
   *         description: User account successfully deleted
   *       400:
   *         description: Bad request or validation error
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       500:
   *         description: Internal server error
   */
  app.get("/api/deleteuser", jwtMiddleware, auth.deleteuser);
};

/* 0. 테스트 API
  // app.get('/app/test', auth.getTest)

  // 1. 유저 생성 (회원가입) API
  app.post("/app/users", auth.postUsers);

  // 2. 유저 조회 API (+ 검색)
  app.get("/app/users", auth.getUsers);

  // 3. 특정 유저 조회 API
  app.get("/app/users/:userId", auth.getUserById);

  // 특정 product 조회 API
  app.get("/app/product", auth.getProduct);

  // TODO: After 로그인 인증 방법 (JWT)
  // 로그인 하기 API (JWT 생성)
  app.post("/app/login", auth.login);

  // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
  // app.patch("/app/users/:userId", jwtMiddleware, auth.patchUsers);*/
