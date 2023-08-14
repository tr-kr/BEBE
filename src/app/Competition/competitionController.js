const jwtMiddleware = require("../../../config/jwtMiddleware");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const competitionProvider = require("./competitionProvider");
const competitionService = require("./competitionService");

const views = require("../../../views/template");
const path = require('path');

exports.uploadImage = async function (req,res){
    if (!req.file) {
        return res.status(400).json({ message: 'No image file provided.' });
      }
      // 업로드된 파일의 경로를 반환 (예: '/uploads/1627394887305.jpg')
      const uploadedFilePath = req.file.path;
      res.status(200).json({ imageUrl: uploadedFilePath });
}

/*
 * API No. 0
 * API Name : 메인화면 반환
 * [GET] /
 */
exports.index = async function (req,res){
    const html = views.HTML();
    res.send(html);
}

/*
 * API No. 1
 * API Name : 대회 목록 반환
 * [GET] /api/competitions/:competitionId
 */
exports.getCompetition = async function (req,res){
    const id = req.params.competitionId;

    if (!id) {
        // 대회 목록 전체 조회
        const competitionResultList = await competitionProvider.retrieveCompetitionList();
        return res.send(response(baseResponse.SUCCESS, competitionResultList));
    } else {
        // 특정 대회 조회
        const competitionResultListById = await competitionProvider.retrieveCompetitionList(id);
        return res.send(response(baseResponse.SUCCESS, competitionResultListById));
    }
}

/*
 * API No. 2
 * API Name : 대회 등록
 * [POST] /api/competition
 */
exports.registCompetition = async function (req, res) {
    try {
        const { competition_title, competition_content, event, dead_date, qualification, prize, pre_date, final_date } = req.body;
        // const poster_path = req.file.path;
        const poster_path = req.files['photo'] ? req.files['photo'].map(photo => photo.path).join(',') : '';
        const pdf_path = req.files['pdf'] ? req.files['pdf'].map(pdf => pdf.path).join(',') : '';

        const createCompetitionResponse = await competitionService.createCompetition(
            competition_title, competition_content, event, dead_date, qualification, 
            prize, pre_date, final_date, poster_path, pdf_path);

        return res.send(createCompetitionResponse);
    } catch (error) {
        // 에러 처리
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};


/*
 * API No. 3
 * API Name : 대회 수정
 * [PUT] /api/competition/:competitionId
 */
exports.updateCompetition = async function (req, res) {
    competitionId = req.params.competitionId;
    const { competition_title, competition_content, event, dead_date, qualification, prize, pre_date, final_date } = req.body;

    //const poster_path = req.file.path;
    const poster_path = req.files['photo'] ? req.files['photo'].map(photo => photo.path).join(',') : '';
    const pdf_path = req.files['pdf'] ? req.files['pdf'].map(pdf => pdf.path).join(',') : '';

    const updateCompetitionResponse = await competitionService.updateCompetition(
        competitionId, competition_title, competition_content, event, dead_date, qualification, prize, pre_date, final_date, poster_path, pdf_path);

    return res.send(updateCompetitionResponse);
};

/*
 * API No. 4
 * API Name : 대회 삭제
 * [DELETE] /api/competition/:compId
 */
exports.deleteCompetition = async function (req, res) {
    competitionId = req.params.competitionId;

    const deleteCompetitionResponse = await competitionService.deleteCompetition(competitionId);

    return res.send(deleteCompetitionResponse);
};



// /**
//  * API No. 0
//  * API Name : 테스트 API
//  * [GET] /app/test
//  */
// exports.getTest = async function (req, res) {
//     return res.send(response(baseResponse.SUCCESS))
// }

// /**
//  * API No. 1
//  * API Name : 유저 생성 (회원가입) API
//  * [POST] /app/users
//  */
// exports.postUsers = async function (req, res) {

//     /**
//      * Body: email, password, nickname
//      */
//     const {email, password, nickname} = req.body;

//     // 빈 값 체크
//     if (!email)
//         return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

//     // 길이 체크
//     if (email.length > 30)
//         return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

//     // 형식 체크 (by 정규표현식)
//     if (!regexEmail.test(email))
//         return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

//     // 기타 등등 - 추가하기


//     const signUpResponse = await userService.createUser(
//         email,
//         password,
//         nickname
//     );

//     return res.send(signUpResponse);
// };

// /**
//  * API No. 2
//  * API Name : 유저 조회 API (+ 이메일로 검색 조회)
//  * [GET] /app/users
//  */
// exports.getUsers = async function (req, res) {

//     /**
//      * Query String: email
//      */
//     const email = req.query.email;

//     if (!email) {
//         // 유저 전체 조회
//         const userListResult = await userProvider.retrieveUserList();
//         return res.send(response(baseResponse.SUCCESS, userListResult));
//     } else {
//         // 유저 검색 조회
//         const userListByEmail = await userProvider.retrieveUserList(email);
//         return res.send(response(baseResponse.SUCCESS, userListByEmail));
//     }
// };

// /**
//  * API No. 3
//  * API Name : 특정 유저 조회 API
//  * [GET] /app/users/{userId}
//  */
// exports.getUserById = async function (req, res) {

//     /**
//      * Path Variable: userId
//      */
//     const userId = req.params.userId;

//     if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

//     const userByUserId = await userProvider.retrieveUser(userId);
//     return res.send(response(baseResponse.SUCCESS, userByUserId));
// };

// // TODO: After 로그인 인증 방법 (JWT)
// /**
//  * API No. 4
//  * API Name : 로그인 API
//  * [POST] /app/login
//  * body : email, passsword
//  */
// exports.login = async function (req, res) {

//     const {email, password} = req.body;

//     // TODO: email, password 형식적 Validation

//     const signInResponse = await userService.postSignIn(email, password);

//     return res.send(signInResponse);
// };

// /**
//  * API No. 5
//  * API Name : 회원 정보 수정 API + JWT + Validation
//  * [PATCH] /app/users/:userId
//  * path variable : userId
//  * body : nickname
//  */
// exports.patchUsers = async function (req, res) {

//     // jwt - userId, path variable :userId

//     const userIdFromJWT = req.verifiedToken.userId

//     const userId = req.params.userId;
//     const nickname = req.body.nickname;

//     if (userIdFromJWT != userId) {
//         res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//     } else {
//         if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

//         const editUserInfo = await userService.editUser(userId, nickname)
//         return res.send(editUserInfo);
//     }
// };

// /** JWT 토큰 검증 API
//  * [GET] /app/auto-login
//  */
// exports.check = async function (req, res) {
//     const userIdResult = req.verifiedToken.userId;
//     console.log(userIdResult);
//     return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
// };