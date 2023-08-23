const jwtMiddleware = require("../../../config/jwtMiddleware");
const authProvider = require("./authProvider");
const authService = require("./authService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const http = require("http");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

const { emit } = require("nodemon");
const { append } = require("vary");

//로그인 light
const logger = require("winston"); // 또는 다른 로깅 라이브러리 사용

exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    if (!email) {
      return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));
    }
    if (!password) {
      return res.send(response(baseResponse.SIGNIN_PASSWORD_WRONG));
    }

    const postLoginRes = await authService.login(email, password);
    return res.json({
      isSuccess: true,
      data: postLoginRes,
    });
  } catch (exception) {
    logger.error(`App - login error\n: ${exception.message}`);
    return res.send(exception);
  }
};

/*로그아웃 light
exports.logout = async function (req, res) {
  User.findOneAndUpdate({ _id: req.userid }, { token: "" }, (err, user) => {
    if (err) return res.send(response(baseResponse.SUCCESS));
  });
};

/*로그인 인가 light = jwtMiddleware.js
exports.verifyToken = async function (req, res) {
  const token = req.headers["access-token"];
  try {
    if (!token) {
      return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    //TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 401, "message":"JWT 토큰 검증 실패" },

    jwt.verify(jwt, secretKey); // Simply verify the token validity
    return res.json({ message: "Token is valid" });
  } catch (error) {
    return res.send(response(baseResponse.SUCCESS));
  }
};*/

//////////////////////////////////////////////////////////////////////////////////
/** */

/**비밀번호 보완
 * 관리자도 보기 힘든 조건을 만족하기 위해 bcrypt 이용
 * const bcrypt = require('bcrypt)
 * const saltRounds = 10
 */

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */

/*exports.getTest = async function (req, res) {
  return res.send(response(baseResponse.SUCCESS));
};

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
/*exports.postUsers = async function (req, res) {
  /**
   * Body: user_id, password, nickname
   
  const { user_id, password, nickname } = req.body;*/

/* 값 체크
  if (!user_id) return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

  // 길이 체크
  if (user_id.length > 30)
    return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

  // 형식 체크 (by 정규표현식)
  if (!regexEmail.test(user_id))
    return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));
};
// 비밀번호, 닉네임, 나이, 핸드폰번호, 이메일
/**if(!password) return res.send(PASSWWORD_EMPTY);
   * if(password.length <6 || password.length > 20) return res.sen(PASSWORD_LENGTH-ERROR);
   * 
   * if(!age) return res.send(AGE_EMPTY);
   * if(!phone_number) return res.send(PHONNE_NUMBER_EMPTY);
   * 
   * 
   * 
   * const signUpResponse = await createUser(user_id, password. nickname, age, phone_number, email);
   * return res.send(signUpResponse);
};/
  

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
/**exports.getUsers = async function (req, res) {

   * Query String: email
  
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
}; */

/*exports.getProduct = async function (req, res) {
  const productId = req.query.productId;

  if (!productId) {
    // Product 조회
    const productListResult = await userProvider.retrieveProductList();
    return res.send(response(baseResponse.SUCCESS, productListResult));
  } else {
    // Product id로  검색 조회
    const productListByProductid = await userProvider.retrieveProductList(
      productId
    );
    return res.send(response(baseResponse.SUCCESS, productListByProductid));
  }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
/*exports.getUserById = async function (req, res) {
  /**
   * Path Variable: userId
   */
/*const user_Id = req.params.userId;

  if (!user_Id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

  const userByUserId = await userProvider.retrieveUser(user_Id);
  return res.send(response(baseResponse.SUCCESS, userByUserId));
};*/

// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */

/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
/**exports.patchUsers = async function (req, res) {
  // jwt - userId, path variable :userId

  const user_IdFromJWT = req.verifiedToken.user_Id;

  const user_Id = req.params.userId;
  const nickname = req.body.nickname;

  if (userIdFromJWT != user_Id) {
    res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
  } else {
    if (!nickname)
      return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

    const editUserInfo = await userService.editUser(user_Id, nickname);
    return res.send(editUserInfo);
  }
};

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
exports.check = async function (req, res) {
  const userIdResult = req.verifiedToken.userId;
  console.log(userIdResult);
  return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};*/
