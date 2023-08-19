const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret = require("../../../config/secret");
const authProvider = require("./authProvider");
const authDao = require("./authDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");
const jwtMiddleware = require("../../../config/jwtMiddleware");
const secretKey = secret.jwtsecret;

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

//로그인 light
const SHA512 = require("sha512"); // SHA256 해시 함수 라이브러리 사용
//const jwtService = require("./jwtService"); // jwtService 모듈의 경로에 따라 수정

exports.login = async function (account, password) {
  //async login(postLoginReq) {

  try {
    const users = await authProvider.getPwd(account, password); // 비밀번호
    if (users.length === 0) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);
    const user = users[0];
    console.log(user);
    let encryptPwd;

    try {
      encryptPwd = await crypto
        .createHash("sha512")
        .update(password)
        .digest("hex");
      console.log(`암호화 된 비밀번호: ${encryptPwd}`);
    } catch (e) {
      throw new Error("PASSWORD_ENCRYPTION_ERROR");
    }

    if (user.password === encryptPwd) {
      const useridx = user.id;
      const token = jwt.sign({ useridx }, secretKey, { expiresIn: "1h" });

      return {
        useridx: useridx,
        jwt: token,
      };
    } else {
      //throw new Error("FAILED_TO_LOGIN");
      return response(baseResponse.SIGNIN_PASSWORD_WRONG);
    }
  } catch (error) {
    // 로깅 및 예외 처리
    logger.error(error);
    throw error; // 처리된 예외 다시 던지기
  }
  // }
};
// class AuthService {
//   constructor(authDao, authProvider, jwtService) {
//     this.authDao = authDao;
//     this.authProvider = authProvider;
//     this.jwtService = jwtService;
//   }

// }

// module.exports = AuthService;

/*로그인 light : JWT토큰 발급, 최초 로그인 했을 때 accessToken 과 refreshToken 발급해주는 부분
require("dotenv").config();

const token = () => {
  return{
    access(id){
      return jwt.sign({id}, process.env.ACCESS_TOEKN_SECRET, {
        expiresIn: "15m",
      });
    },
    refresh(id){
      return jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "180 days",
      });
    }
  }
}

exports.userLogin = (req, res) =>{
  res.send('userLogin');
}

exports. authenticate =  (req, res, next) => {
  if(req.query.id == 'hello'){ //id가 일치할 때
    req.authData = {
      status : 200,
      message : 'Correct User Data',
      jwt:{
        accesToken : token().access(req.query.id),
        refreshToken : token().refresh(req.query.id)
      }
    };
  }else{
    req.authData = {
      status : 400,
      message : 'Not Correct User Data'
    };
  }
  next();
}*/

//////////////////////////////////////////////
/* Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (email, password, nickname) {
  try {
    // 이메일 중복 확인
    const emailRows = await userProvider.emailCheck(email);
    if (emailRows.length > 0)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

    // 비밀번호 암호화
    const hashedPassword = await crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");

    const insertUserInfoParams = [email, hashedPassword, nickname];

    const connection = await pool.getConnection(async (conn) => conn);

    const userIdResult = await userDao.insertUserInfo(
      connection,
      insertUserInfoParams
    );
    console.log(`추가된 회원 : ${userIdResult[0].insertId}`);
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - createUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (email, password) {
  try {
    // 이메일 여부 확인
    const emailRows = await userProvider.emailCheck(email);
    if (emailRows.length < 1)
      return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

    const selectEmail = emailRows[0].email;

    // 비밀번호 확인
    const hashedPassword = await crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");

    const selectUserPasswordParams = [selectEmail, hashedPassword];
    const passwordRows = await userProvider.passwordCheck(
      selectUserPasswordParams
    );

    if (passwordRows[0].password !== hashedPassword) {
      return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
    }

    // 계정 상태 확인
    const userInfoRows = await userProvider.accountCheck(email);

    if (userInfoRows[0].status === "INACTIVE") {
      return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
    } else if (userInfoRows[0].status === "DELETED") {
      return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
    }

    console.log(userInfoRows[0].id); // DB의 userId

    //토큰 생성 Service
    let token = await jwt.sign(
      {
        userId: userInfoRows[0].idx,
        type: "JWT",
        userName: userName,
      }, // 토큰의 내용(payload)
      secret_config.jwtsecret, // 비밀키
      {
        expiresIn: "365d",
        subject: "userTB",
      } // 유효 기간 365일
    );

    return response(baseResponse.SUCCESS, {
      userId: userInfoRows[0].id,
      jwt: token,
    });
  } catch (err) {
    logger.error(
      `App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(
        err
      )}`
    );
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.editUser = async function (id, nickname) {
  try {
    console.log(id);
    const connection = await pool.getConnection(async (conn) => conn);
    const editUserResult = await userDao.updateUserInfo(
      connection,
      id,
      nickname
    );
    connection.release();

    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - editUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};*/
