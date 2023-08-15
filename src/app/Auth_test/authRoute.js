const { redirect } = require("react-router-dom");

module.exports = function (app) {
  const user = require("./authController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  //made by ryu
  //////////////////////////////////////////////////////////////////
  const nodemailer = require("nodemailer");
  const secret = require("../../../config/secret");
  const secretKey = secret.jwtsecret;
  const jwt = require("jsonwebtoken");

  const transporter = nodemailer.createTransport({
    service: "Naver", // 이메일 서비스
    host: "smtp.naver.com",
    port: 587,
    secure: false,
    auth: {
      user: "richknk@naver.com", // 보내는 이메일 주소
      pass: "@^^NAKss0010", // 비밀번호 또는 액세스 토큰
    },
  });

  app.post("/send-verification-email", (req, res) => {
    const { email } = req.body;
    console.log(email);
    //const email = `ryu_eclipse@naver.com`;
    // 토큰 생성
    const token = jwt.sign({ email }, secretKey, { expiresIn: "30000" });

    // 이메일 내용 템플릿 생성
    const emailContent = `
        <p>본인 확인을 위해 아래 링크를 클릭하세요:</p>
        http://localhost:3000/verify?token=${token}
      `;

    const mailOptions = {
      from: "won000111@naver.com",
      to: email,
      subject: "본인 확인 이메일",
      html: emailContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("이메일 전송 오류:", error);
        res.status(500).json({ message: "이메일 전송 오류" });
      } else {
        console.log("이메일 전송 성공:", info.response);
        res.status(200).json({ message: "이메일 전송 완료" });
      }
    });
  });

  app.get("/verify", (req, res) => {
    const { token } = req.query;

    try {
      const decoded = jwt.verify(token, secretKey);
      console.log(decoded.email);
      user.verifyEmail(decoded.email);
      // 토큰 유효한 경우
      // 본인 확인 완료 처리 후 클라이언트에게 키 전송 등의 작업 수행
      res.status(200).json({ message: "본인 확인이 완료되었습니다." });
    } catch (error) {
      // 토큰 무효한 경우
      res.status(400).json({ message: "유효하지 않은 토큰" });
    }
  });
  ///////////////////////////////////////////////////////////////////////

  // 0. 테스트 API
  // app.get('/app/test', user.getTest)

  // // 1. 유저 생성 (회원가입) API
  app.post("/app/users", user.postUsers);

  /////////////////////////////////////회원가입
  app.post("/api/users/register/accountCheck", user.accountCheckTest);
  app.post("/api/users/register/emailCheck", user.emailCheckTest);
  app.post("/api/users/register", user.register);
  //app.post('/api/users/verify-email', user.verifyEmail);

  // 2. 유저 조회 API (+ 검색)
  app.get("/app/users", user.getUsers);

  // TODO: After 로그인 인증 방법 (JWT)
  // 로그인 하기 API (JWT 생성)
  app.post("/app/login", user.login);

  // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
  app.patch("/app/users/:userId", jwtMiddleware, user.patchUsers);
  ////////////////////////////////////////////////////////////////
  //작성자 : 류지원
  //디스코드, 라이엇 인증 API

  /*     app.get('/api/auth/discord', user.tryAuthDiscord);

    //계정인증시 콜백
    app.get('/api/auth/discord/success', user.authDiscord); */
  /* 
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

    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code : code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        scope: 'identify',
      }).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
      console.log(tokenResponse);


      console.log(6);
      //const accessToken = tokenResponse.data.access_token;
      const accessToken = tokenResponse.data.access_token;
      console.log(2);


     const userResponse = await axios.get('https://discord.com/api/users/@me', {
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

*/
};

// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API

//로그인
