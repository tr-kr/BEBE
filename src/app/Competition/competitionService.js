const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");
const fs = require('fs');

const competitionProvider = require("./competitionProvider");
const competitionDao = require("./competitionDao");
const views = require("../../../views/template");
const multer = require('multer');
const path = require('path');

const util = require('util');
const unlinkPromise = util.promisify(fs.unlink); // Promisify fs.unlink for easier use

// Service: Create, Update, Delete 비즈니스 로직 처리

// 대회 create
exports.createCompetition = async function (competition_title, competition_content, event, dead_date, qualification,
    prize, pre_date, final_date, poster_path, pdf_path) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const createCompetitionParams = [competition_title, competition_content, event, dead_date, qualification,
            prize, pre_date, final_date, poster_path, pdf_path]
        const createCompetitionResult = await competitionDao.createCompetition(connection, createCompetitionParams);
        console.log(`추가된 경기 id : ${createCompetitionResult.insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createCompetition Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 대회 update
exports.updateCompetition = async function (competitionId, competition_title, competition_content, event, dead_date, qualification,
    prize, pre_date, final_date, poster_path) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const updateCompetitionParams = [competition_title, competition_content, event, dead_date, qualification,
            prize, pre_date, final_date, poster_path, pdf_path]
        const updateCompetitionResult = await competitionDao.updateCompetition(connection, competitionId, updateCompetitionParams);
        console.log(`수정된 경기 id : ${updateCompetitionResult.insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - updateCompetition Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 대회 delete
exports.deleteCompetition = async function (competitionId) {
    try {
        const connection = await pool.getConnection(); // Simplified getConnection call
        const competitionPosterPaths = await competitionDao.getPosterPath(connection, competitionId);
        const competitionPdfPaths = await competitionDao.getPdfPath(connection,competitionId);

        const posterPaths = competitionPosterPaths[0].poster_path.split(',').map(item => `.\\${item}`);
        const pdfPaths = competitionPdfPaths[0].pdf_path.split(',').map(item => `.\\${item}`);

        // Use Promise.all for parallel file deletion
        await Promise.all([...posterPaths, ...pdfPaths].map(async (filePath) => {
            try {
                await unlinkPromise(filePath);
                console.log(`${filePath} deleted successfully.`);
            } catch (err) {
                console.error(`Error deleting file ${filePath}: ${err}`);
            }
        }));

        const deleteCompetitionResult = await competitionDao.deleteCompetition(connection, competitionId);
        connection.release();
        return deleteCompetitionResult;
    } catch (error) {
        console.error(`Error in deleteCompetition: ${error}`);
        throw error;
    }
};
// exports.deleteCompetition = async function (competitionId) {
//     try {
//         const connection = await pool.getConnection(async (conn) => conn);
//         const competitionPosterPath = await competitionDao.getPosterPath(connection, competitionId);
//         const posterPath = competitionPosterPath[0].poster_path;
//         const pdfPath = competitionPosterPath[0].pad_path;

//         let posterPathArray = posterPath.split(',');
//         let pdfPathArray = pdfPath.split(',');

//         posterPathArray = posterPathArray.map(item => '.\\' + item);
//         pdfPathArray = pdfPathArray.map(item => '.\\' + item);

//         // const newPath = '.\\' + competitionPosterPath[0].poster_path;
        
//         try {
//             for (const posterPath of posterPathArray) {
//                 await fs.unlink(posterPath);
//                 console.log(`${posterPath} deleted successfully.`);
//             }
//             for (const pdfPath of pdfPathArray){
//                 await fs.unlink(pdfPath);
//                 console.log(`${pdfPath} deleted successfully`);
//             }
//             const deleteCompetitionResult = await competitionDao.deleteCompetition(connection, competitionId);
//             connection.release();
//             return deleteCompetitionResult;
//         }
//         catch (err){
//             console.error(`Error deleteing files : ${err}`);
//             return errResponse(baseResponse.DB_ERROR);
//         }
//     } catch (error) {
//         console.error(`Error in deleteCompetition: ${error}`);
//         throw error;
//     }  
// }
        // console.log(newPath);
        // fs.unlink(newPath, (err) => {
        //     if (err) {
        //         console.error('파일 삭제 중 오류 발생', err)
        //         connection.release();
        //         return;
        //     }
        //     console.log(`삭제된 경기 id : ${competitionId}`)
        //     connection.release();
        // });
        // return response(baseResponse.SUCCESS);
        // } 
    // catch (err) {
    //     logger.error(`App - deleteCompetition Service error\n: ${err.message}`);
    //     return errResponse(baseResponse.DB_ERROR);
    // }




// exports.updateNotice = async function (id, noticeTitle, noticeContents) {
//     try {
//         const updateNoticeParams = [noticeTitle, noticeContents, id];

//         const connection = await pool.getConnection(async (conn) => conn);

//         const noticeResult = await noticeDao.updateNotice(connection, updateNoticeParams);
//         connection.release();
//         return response(baseResponse.SUCCESS);

//     } catch (err) {
//         console.log(err);
//     }
// };
// exports.deleteNotice = async function (noticeId) {
//     try {
//         const connection = await pool.getConnection(async (conn) => conn);

//         const deleteResult = await noticeDao.deleteNotice(connection, noticeId);
//         connection.release();
//         return response(baseResponse.SUCCESS);
//     } catch (err) {
//         console.log(err);
//     }
// };

// exports.createUser = async function (email, password, nickname) {
//     try {
//         // 이메일 중복 확인
//         const emailRows = await userProvider.emailCheck(email);
//         if (emailRows.length > 0)
//             return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

//         // 비밀번호 암호화
//         const hashedPassword = await crypto
//             .createHash("sha512")
//             .update(password)
//             .digest("hex");

//         const insertUserInfoParams = [email, hashedPassword, nickname];

//         const connection = await pool.getConnection(async (conn) => conn);

//         const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
//         console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
//         connection.release();
//         return response(baseResponse.SUCCESS);


//     } catch (err) {
//         logger.error(`App - createUser Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };


// // TODO: After 로그인 인증 방법 (JWT)
// exports.postSignIn = async function (email, password) {
//     try {
//         // 이메일 여부 확인
//         const emailRows = await userProvider.emailCheck(email);
//         if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

//         const selectEmail = emailRows[0].email

//         // 비밀번호 확인
//         const hashedPassword = await crypto
//             .createHash("sha512")
//             .update(password)
//             .digest("hex");

//         const selectUserPasswordParams = [selectEmail, hashedPassword];
//         const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);

//         if (passwordRows[0].password !== hashedPassword) {
//             return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
//         }

//         // 계정 상태 확인
//         const userInfoRows = await userProvider.accountCheck(email);

//         if (userInfoRows[0].status === "INACTIVE") {
//             return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
//         } else if (userInfoRows[0].status === "DELETED") {
//             return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
//         }

//         console.log(userInfoRows[0].id) // DB의 userId

//         //토큰 생성 Service
//         let token = await jwt.sign(
//             {
//                 userId: userInfoRows[0].id,
//             }, // 토큰의 내용(payload)
//             secret_config.jwtsecret, // 비밀키
//             {
//                 expiresIn: "365d",
//                 subject: "userInfo",
//             } // 유효 기간 365일
//         );

//         return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].id, 'jwt': token});

//     } catch (err) {
//         logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };

// exports.editUser = async function (id, nickname) {
//     try {
//         console.log(id)
//         const connection = await pool.getConnection(async (conn) => conn);
//         const editUserResult = await userDao.updateUserInfo(connection, id, nickname)
//         connection.release();

//         return response(baseResponse.SUCCESS);

//     } catch (err) {
//         logger.error(`App - editUser Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// }