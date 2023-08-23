const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/MyInfo/myInfoProvider");
const competitionProvider = require("../../app/Competition/competitionProvider");
const userService = require("../../app/MyInfo/myInfoService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

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
 * [GET] /app/users?token=토큰}
 */
exports.getUserById = async function (req, res) {
    console.log(req.query);
    /**
     * Path Variable: userId
     */
    //const {token} = req.query;
    
    //console.log(req.verifiedToken);
    const userId = req.params.userId;
    //if(req.params.userId) userId = req.params.userId;
    //else userId = req.verifiedToken.useridx;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const userByUserId = await userProvider.retrieveUser(userId);
    console.log('[유저 조회]',userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};

exports.getUserByToken = async function (req, res) {


    //const {token} = req.query;
    
    //console.log(req.verifiedToken);
    const userId = req.verifiedToken.useridx;
    //console.log(userId);
    //if(req.params.userId) userId = req.params.userId;
    //else userId = req.verifiedToken.useridx;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const userByUserId = await userProvider.retrieveUser(userId);
    console.log('[유저 조회]',userId, userByUserId.nickname);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};

exports.getPlayListById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const CompetitionIds = await userProvider.retrievePlayList(userId);
    console.log('[참여한 대회 조회]',userId);

    const playList = [];
    for (const competitionId of CompetitionIds) {
        const result = await competitionProvider.retrieveCompetitionList(competitionId.competition_id);

        playList.push({...result[0],ranking : competitionId.ranking});

    }

    return res.send(response(baseResponse.SUCCESS, playList));
};

exports.getPlayListByToken = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.verifiedToken.useridx;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const CompetitionIds = await userProvider.retrievePlayList(userId);
    console.log('[참여한 대회 조회]',userId);

    const playList = [];
    for (const competitionId of CompetitionIds) {
        const result = await competitionProvider.retrieveCompetitionList(competitionId.competition_id);
        playList.push({...result[0],ranking : competitionId.ranking});

    }

    return res.send(response(baseResponse.SUCCESS, playList));
};


exports.getHostListById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const CompetitionIds = await userProvider.retrieveHostList(userId);
    console.log('[개최한 대회 조회]',userId);


    const hostList = [];
    for (const competitionId of CompetitionIds) {
        const result = await competitionProvider.retrieveHostList(competitionId.competition_id);

        hostList.push({...result[0],ranking : competitionId.ranking});

    }

    return res.send(response(baseResponse.SUCCESS, hostList));
};

exports.getHostListByToken = async function (req, res) {

    /**
     * Path Variable: userId
     */

    const userId = req.verifiedToken.useridx;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const userByUserId = await userProvider.retrieveHostList(userId);
    console.log('[개최한 대회 조회]',userId, userByUserId.nickname);
    
    const hostList = [];
    for (const competitionId of CompetitionIds) {
        const result = await competitionProvider.retrieveHostList(competitionId.competition_id);

        hostList.push({...result[0],ranking : competitionId.ranking});

    }

    return res.send(response(baseResponse.SUCCESS, hostList));
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
    const {nickname, password} = req.body;
    
    const id = req.params.userId;


    const signUpResponse = await userService.editUser(
        id,
        nickname,
        password,
    );

    return res.send(signUpResponse);
};


/**
 * API No. 
 * API Name : 특정 유저 정보 수정 API
 * [GET] /app/user/myInfo?token=
 */
exports.updateUserByToken = async function (req, res) {

    /**
     * Body: email, password, nickname
     */
    const {nickname, password} = req.body;
    
    const id = req.verifiedToken.useridx;

    
    const signUpResponse = await userService.editUser(
        id,
        nickname,
        password,
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
