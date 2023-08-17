const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const authProvider = require("./authProvider");
const authDao = require("./authDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// const connection = await pool.getConnection(async (err, rows) => (err, rows));

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

/*로그인 light
exports.login = async function (req) {
  const json = {
    code: 0,
  };

  const conn = await pool.getConnection();
  const user_id = req.body.user_id;
  const password = req.body.password;

  const query = `SELECT user_id, password WHERE user_id = ?;`;
  const [rows] = await conn.query(query, [user_id]);

  if (rows.length > 0) {
    const userPass = rows[0].password;

    return new Promise((resolve, reject) => {
      hasher(
        { password: password, salt: userSalt },
        (err, pass, salt, hash) => {
          if (hash !== userPass) {
            json.code = 100;
            json.msg = "비밀번호가 틀렸습니다.";
            json.data = {};
          } else {
            json.data = rows[0];
          }
          resolve(json);
        }
      );
    });
  } else {
    json.code = 100;
    json.msg = "찾을 수 없습니다.";
    json.data = {};
    return json;
  }
};*/
