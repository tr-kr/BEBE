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
    const { account, password } = req.body;
    if (!account) {
      return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));
    }
    if (!password) {
      return res.send(response(baseResponse.SIGNIN_PASSWORD_WRONG));
    }

    // if (!isRegexEmail(postLoginReq.email)) {
    //   return res.json({
    //     isSuccess: false,
    //     code: POST_USERS_INVALID_EMAIL,
    //     message: "Invalid email format.",
    //   });
    // }

    const postLoginRes = await authService.login(account, password);
    return res.json({
      isSuccess: true,
      data: postLoginRes,
    });
  } catch (exception) {
    logger.error(`App - login error\n: ${exception.message}`);
    return res.send(exception);
  }
};

/*로그인light
app.post('/login',async(req,res)=>{
  const {id, password} = req.body;
  const user = users.find(u=>u.id === id);
  if(!user) {
      return res.status(400).json('아이디 없음');
  } else {
      const isEqualPw = await bcrypt.compare(password,user.password);
      console.log(isEqualPw);
      if(isEqualPw) 
          return res.status(200).json({msg : "로그인 성공!",user});
      else 
          return res.status(404).json({msg : "로그인 실패"});
  }
});

//로그인light
app.use(cookieParser());

app.use(
  expressSession({
    secret: "my key",
    resave: true,
    saveUninitialized: true,
  })
);

exports.login = async function (req, res) {
  console.log("로그인 함수가 실행됩니다.");

  console.log(req.body.data);
  console.log(req.password);

  const paramID = req.body.id || req.query.id;
  const pw = req.body.password || req.query.password;

  if (req.session.user) {
    console.log("이미 로그인 되었습니다.");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf8" });
    res.write("<h1> already Login</h1>");
    res.write(`[ID] : ${paramID} [PW] : ${pw}`);
    res.write('<a href="/api/example">예시로<a>');
    res.end();
  } else {
    req.session.user = {
      id: paramID,
      pw: pw,
      name: "UsersNames!!!",
      authorized: true,
    };
    res.writeHead(200, { "Content-Type": "text/html; charset=utf8" });
    res.write("<h1>Login Success</h1>");
    res.write(`[ID] : ${paramID} [PW] : ${pw}`);
    res.write('<a href="/api/example">Move</a>');
    res.end();
  }
  const { email, password } = req.body;

  const SignInResponse = await userService.postSignIn(email, password);

  return res.send("SignInResponse");
};

exports.logout = async function (req, res) {
  console.log("로그아웃");

  if (req.session.user) {
    console.log("로그아웃중입니다!");
    req.session.destory((err) => {
      if (err) {
        console.log("세션 삭제시에 에러가 발생했습니다.");
        return;
      }
      console.log("세션이 삭제됐습니다.");
      res.redirect("/login.html");
    });
  } else {
    console.log("비로그인 상태입니다.");
    res.redirect("/login.html");
  }
};
const appServer = http.createServer(app);

appServer.listen(app.get("port"), () => {
  console.log(`${app.get("port")}에서 서버실행중`);
});

//로그인 light
exports.login = async function (req, res) {
  const { email, pw } = req.body;
  const sql = `SELECT * FROM User WHERE email="${email}"`;
  connection.query(sql, function (err, rows, fields) {
    if (err) {
      console.log(err);
      return res.status(statusCode.NOT_FOUND).send(messageCode.REQUEST_FAIL);
    } else {
      if (rows.length === 0) {
        return res.status(statusCode.MATCH_ERR).send(messageCode.INVALID_USER);
      } else if (pw !== rows[0].pw) {
        return res.status(statusCode.MATCH_ERR).send(messageCode.INVALID_PW);
      } else {
        var token = jwt.sign(
          {
            email: email,
          },
          process.env.JWT_SECRET
        );

        return res.status(statusCode.SUCCESS).json({
          code: statusCode.SUCCESS,
          message: messageCode.SIGN_IN_SUCCESS,
          userIdx: rows[0].id,
          token: token,
        });
      }
    }
  });
};

//로그인 light
exports.login = async function (req, res, next) {
  var id = req.body.id;
  var pw = req.body.pw;

  var query = "select salt, password from where userid='" + id + "';";
  console.log(query);
  connection.query(query, function (err, rows) {
    if (err) throw err;
    else {
      if (rows.length == 0) {
        //아이디 존재하지 않는 경우
        console.log("아이디가 틀렸습니다");
        res.redirect("/login");
      } else {
        var salt = rows[0].salt;
        var password = rows[0].password;
        const hashPassword = crypto
          .createHash("sha512")
          .update(pw + salt)
          .diget("hex");
        if (password == hashPassword) {
          //로그인 성공
          console.log("로그인 성공");
          res.cookie("user", id, {
            expires: new Date(Date.now() + 900000),
            httpOnly: true,
          });
          res.redirect("/");
        } else {
          //로그인실패
          console.log("비밀번호 틀렸습니다");
          res.redirect("/login");
        }
      }
    }
  });
};

//로그인 light
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
