const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("./authProvider");
const userService = require("./authService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

const axios = require('axios');
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
    const {account, password, nickname, email, birth} = req.body;

    const signUpResponse = await userService.createUser(
        account,
        email,
        password,
        nickname,
        birth
    );
    return res.send(signUpResponse);
};
exports.verifyEmail = async function (req, res) {

    /**
     * Body: email, password, nickname
     */
    const {email} = req.body;

    const verifyResponse = await userService.verifyEmail(
        email
    );

    return res.send(verifyResponse);
};



exports.accountCheckTest = async function (req, res){
    const {account} = req.body;
    if(account.length == 0) 
        return res.send(baseResponse.USER_USERID_EMPTY);


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
        return res.send(baseResponse.SIGNIN_EMAIL_EMPTY);


    const emailCheckResponse = await userProvider.emailCheck(
        email
    );
    if (emailCheckResponse.length > 0)
        return res.send(errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL));

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
const CLIENT_SECRET = '4f34a94c10adfd93b336fd0265fc8157ea9421b6a35c911e2559fa0f6c9c15d1';
const REDIRECT_URI = 'http://localhost:3000/api/auth/discord/success';


exports.tryAuthDiscord = async function(req, res){
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`);
}

exports.authDiscord = async function(req, res){
    const code = req.query.code;

    const tokenParams = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
    });
  
    try {
      const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', tokenParams.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      const accessToken = tokenResponse.data.access_token;
  
      const userResponse = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const user = userResponse.data;
      // 여기서 user 정보를 활용하여 사용자 인증 및 처리 로직을 진행합니다.
  
      res.send(`Hello, ${user.username}#${user.discriminator}!`);
    } catch (error) {
      console.error('Error:', error);
      res.send('An error occurred.');
    }

}








