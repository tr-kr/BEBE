const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("./authProvider");
const userService = require("./authService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

const axios = require('axios');
//made by ryu
//////////////////////////////////////////////////////////////////
const nodemailer = require('nodemailer');
const secret = require('../../../config/secret');
const secretKey = secret.jwtsecret;
const jwt = require('jsonwebtoken');
const baseResponseStatus = require("../../../config/baseResponseStatus");


/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
// exports.getTest = async function (req, res) {
//     return res.send(response(baseResponse.SUCCESS))
// }

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */



exports.postUsers = async function (req, res) {

    /**
     * Body: email, password, nickname
     */
    const {email, password, nickname} = req.body;

    // 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 기타 등등 - 추가하기


    const signUpResponse = await userService.createUser(
        email,
        password,
        nickname
    );

    return res.send(signUpResponse);
};

exports.register = async function (req, res) {

    /**
     * Body: email, password, nickname
     */
    const { password, name, nickname, email, birth} = req.body;

    const signUpResponse = await userService.createUser(
       // account,
        email,
        password,
        name,
        nickname,
        birth
    );
   // console.log(signUpResponse.result.id);



    if(signUpResponse.isSuccess === true){ // 회원가입 성공시 
      const data = {
        id : signUpResponse.result.id,
        email : email
      }
      const headers = {
        'Content-Type': 'application/json'
      }
      const sendEmailResponse = await axios.post('http://172.30.1.99:3000/api/verification/send-verification-email',data, {headers});
      //return res.send({sendEmailResponse});
      if(sendEmailResponse.isSuccess === false)
        return sendEmailResponse;
    }
    return res.send(signUpResponse);
};

const transporter = nodemailer.createTransport({
    service: 'Gmail', // 이메일 서비스
    host: 'smtp.gmail.com',
    port: 587,
    secure : false,
    auth: {
      user: 'trkrmanager@gmail.com', // 보내는 이메일 주소
      pass: 'ykiyecygodrzsanu' // 비밀번호 또는 액세스 토큰
    }
  });

  exports.send_verification_email = async function(req, res){


    const { id, email } = req.body;
    console.log(id, email);
    //const email = `ryu_eclipse@naver.com`;
    // 토큰 생성
    const token = jwt.sign({ id,email }, secretKey, { expiresIn: '1h' });
  
    // 이메일 내용 템플릿 생성
    const emailContent = `
      <p>본인 확인을 위해 아래 링크를 클릭하세요:</p>
      http://172.30.1.99:3000/api/verification/verify?token=${token}
    `;
    const mailOptions = {
      from: 'trkrmanager@gmail.com',
      to: email,
      subject: '본인 확인 이메일',
      html: emailContent
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('이메일 전송 오류:', error);
        res.status(500).json({ message: '이메일 전송 오류' });
      } else {
        console.log('이메일 전송 성공:', info.response);
        res.status(200).json({ message: '이메일 전송 완료' });
      }
    })
};
async function verifyEmail(req, res) {

    /**
     * Body: email, password, nickname
     */
    //console.log(req);
    const {id, email} = req;

    //console.log('컨트롤러,', email);
    const verifyResponse = await userService.verifyEmail(id);
    //console.log(verifyResponse);
    return verifyResponse;
};

exports.verify = async function(req, res){
    const { token } = req.query;
    
    try {
      const decoded = jwt.verify(token, secretKey);
      console.log(decoded.email);
      
      // verifyEmail({id : decoded.id})
      // .then(result =>{
      //   //console.log('qqq' + result);
      // })
      // .catch(err =>{
      //   //console.log('zz' + err);
      // })

      const {id, email} = decoded;

      //console.log('컨트롤러,', email);
      const verifyResponse = await userService.verifyEmail(id);
      //console.log(verifyREsult);
      // 토큰 유효한 경우
      // 본인 확인 완료 처리 후 클라이언트에게 키 전송 등의 작업 수행
      res.status(200).json({ message: '본인 확인이 완료되었습니다.' });
    } catch (error) {
      // 토큰 무효한 경우
      res.status(400).json({ message: '유효하지 않은 토큰' });
    }
};



/////////////////////////////////////////////////////
//학교이메일 
exports.send_verification_school_email = async function(req, res){

//곧 토큰방식으로 교체 예정
  const { id, email } = req.body;
  console.log(id, email);
  // 토큰 생성
  const token = jwt.sign({ id, email }, secretKey, { expiresIn: '1h' });

  // 이메일 내용 템플릿 생성
  const emailContent = `
    <p>본인 확인을 위해 아래 링크를 클릭하세요:</p>
    http://localhost:3000/api/verification/verify_school?token=${token}
  `;

  const mailOptions = {
    from: 'trkrmanager@gmail.com',
    to: email,
    subject: '본인 확인 이메일',
    html: emailContent
  };


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('이메일 전송 오류:', error);
      res.status(500).json({ message: '이메일 전송 오류' });
    } else {
      console.log('이메일 전송 성공:', info.response);
      res.status(200).json({ message: '이메일 전송 완료' });
    }
  })
};

// async function update_school(req, res) {

//   /**
//    * Body: email, password, nickname
//    */
//   //console.log(req);
//   const {id, email} = req;

//   //console.log('컨트롤러,', email);
//   const verifyResponse = await userService.verifySchool(id, email);
//   //console.log(verifyResponse);
//   return verifyResponse;
// };

exports.verify_school = async function(req, res){
  const { token } = req.query;
  
  try {
    const decoded = jwt.verify(token, secretKey);
    //console.log(decoded.id, decoded.email);
    const {id, email} = decoded;
    console.log(id, email);
    const verifyResponse = await userService.verifySchool(id, email);
    // update_school({id : decoded.id, email : decoded.email})
    // .then(result =>{
    //   //console.log('qqq' + result);
    // })
    // .catch(err =>{
    //   //console.log('zz' + err);
    // })

    //console.log(verifyREsult);
    // 토큰 유효한 경우
    // 본인 확인 완료 처리 후 클라이언트에게 키 전송 등의 작업 수행
    res.status(200).json({ message: '본인 확인이 완료되었습니다.' });
  } catch (error) {
    // 토큰 무효한 경우
    res.status(400).json({ message: '유효하지 않은 토큰' });
  }
};






exports.accountCheckTest = async function (req, res){
    const {account} = req.body;
    if(account.length == 0) 
        return res.send(baseResponse.SIGNUP_ACCOUNT_EMPTY);


    const accountCheckResponse = await userProvider.accountCheckTest(
        account
    );
    if (accountCheckResponse.length > 0)
        return res.send(errResponse(baseResponse.SIGNUP_REDUNDANT_ACCOUNT));

    return res.send(baseResponse.SUCCESS);
};
exports.emailCheckTest = async function (req, res){
    const {email} = req.body;
    if(email.length == 0) 
        return res.send(baseResponse.SIGNUP_EMAIL_EMPTY);


    const emailCheckResponse = await userProvider.emailCheck(
        email
    );
    if (emailCheckResponse.length > 0)
        return res.send(errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL));

    return res.send(baseResponse.SUCCESS);
};
exports.nicknameCheckTest = async function (req, res){
    const {nickname} = req.body;
    if(nickname.length == 0) 
        return res.send(baseResponse.SIGNUP_NICKNAME_EMPTY);


    const nicknameCheckResponse = await userProvider.nicknameCheck(
        nickname
    );
    if (nicknameCheckResponse.length > 0)
        return res.send(errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME));

    return res.send(baseResponse.SUCCESS);
};



/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const userByUserId = await userProvider.retrieveUser(userId);
    console.log(userByUserId.email);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};

/**
 * API No. 
 * API Name : 특정 유저 정보 수정 API
 * [GET] /app/users/{userId}
 */
exports.updateUser = async function (req, res) {

    /**
     * Body: email, password, nickname
     */
    const {nickname, password, age, phone_number, email} = req.body;
    const id = req.params.userId;
    // // 빈 값 체크
    // if (!email)
    //     return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // // 길이 체크
    // if (email.length > 30)
    //     return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // // 형식 체크 (by 정규표현식)
    // if (!regexEmail.test(email))
    //     return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // // 기타 등등 - 추가하기


    const signUpResponse = await userService.editUser(
        id,
        nickname,
        password
    );

    return res.send(signUpResponse);
};








// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    // TODO: email, password 형식적 Validation

    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const nickname = req.body.nickname;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};











/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};



const CLIENT_ID = '1138439231073693736';
const CLIENT_SECRET = 'X1RhkGDGGwbHCnhuj6SDTPsMGodUOwe4';
const REDIRECT_URI = 'http://localhost:3000/api/auth/discord/callback';



exports.tryDiscord = async function(req, res){
  //await axios.get(`https://discord.com/api/v10/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`);
  const id = req.params.id;
  res.redirect(`https://discord.com/api/v10/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`);
}

exports.callbackDiscord = async function(req, res){
  const code = req.query.code;
  const params = new URLSearchParams();
  let user;
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', REDIRECT_URI);

  try{
    const tokenResponse = await axios.post('https://discord.com/api/v10/oauth2/token', params);

    const accessToken = tokenResponse.data.access_token;
    //console.log(accessToken);

    const userResponse = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const user = userResponse.data;

    //console.log(user);
    
    //return user.username;
    //const discord = user.usernmae + user.discriminator;
    //res.redirect('/api/auth/discord/update');

    res.send(response(baseResponseStatus.SUCCESS,`${user.username}#${user.discriminator}`));
    //await userService.verifyDiscord(id, discord);

  }catch(err){
    console.log('에러어레', err);
    return res.send(errResponse(baseResponseStatus.SIGNIN_EMAIL_ERROR_TYPE));
  }  
};

exports.updateDiscord = async function(req, res) {

  /**
   * Body: email, password, nickname
   */
  //console.log(req);
  const {id, discord} = req.body;

  //console.log('컨트롤러,', email);
  const verifyResponse = await userService.verifyDiscord(id, discord);
  //console.log(verifyResponse);
  return res.send(verifyResponse);
};