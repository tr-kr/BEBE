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
        const connection = await pool.getConnection();
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

// 대회 팀 등록
exports.entryCompetitionTeam = async function (competitionId, entryCompetitionParams){
    try{
        const connection = await pool.getConnection();
        
        await competitionDao.entryCompetitionTeam(connection, competitionId, entryCompetitionParams);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(error){
        logger.error(`App - entryCompetitionTeam Service error\n: ${error}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}