module.exports = function (app) {
  const auth = require("./authController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  //로그인,로그아웃,회원가입,로그인 인가 light
  //app.post("/api/login", auth.login);
  //app.get("/api/logout", auth.logout);
  //app.get("/api/verify-token", auth.verifyToken);

  /**
   * @swagger
   * /api/login:
   *   post:
   *     summary: User login
   *     description: Use this API to log in a user with their email and password.
   *     tags:
   *       - Authentication
   *     parameters:
   *       - in: body
   *         name: body
   *         required: true
   *         description: Login credentials
   *         schema:
   *           type: object
   *           properties:
   *             email:
   *               type: string
   *               description: User's email
   *             password:
   *               type: string
   *               description: User's password
   *     responses:
   *       200:
   *         description: Successful login
   *         schema:
   *           type: object
   *           properties:
   *             useridx:
   *               type: integer
   *               description: User ID
   *             jwt:
   *               type: string
   *               description: JWT token for authentication
   *       400:
   *         description: Bad request
   *       500:
   *         description: Internal server error
   */
  app.post("/api/login", auth.login);
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
