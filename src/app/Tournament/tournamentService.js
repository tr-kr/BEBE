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

const tournamentProvider = require("./tournamentProvider");
const tournamentDao = require("./tournamentDao");
const views = require("../../../views/template");
const multer = require('multer');
const path = require('path');

const util = require('util');
const { recordWinner } = require("./tournamentController");
const unlinkPromise = util.promisify(fs.unlink); // Promisify fs.unlink for easier use

// Service: Create, Update, Delete 비즈니스 로직 처리

// 대진표 초기설정
exports.createTournamentBracket = async function (competitionId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const createTournamentBracketResult = await tournamentDao.createTournamentBracket(connection, competitionId);

        connection.release();
        return response(baseResponse.SUCCESS);
    }
    catch (error) {

        logger.error(`App - createTournamentBracket Service error\n: ${error.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 대진표 승리팀 처리
exports.recordWinner = async function (competitionId, teamId, round, matchNumber) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const recordWinnerResult = await tournamentDao.recordWinner(connection, competitionId, teamId, round, matchNumber);

        connection.release();
        return response(baseResponse.SUCCESS);
    }
    catch (err) {
        logger.error(`App - recordWinner Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 대회 결과 저장
exports.saveTournamentResult = async function (competitionId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const saveTournamentResultSet = await tournamentDao.saveTournamentResult(connection, competitionId);

        connection.release();
        return response(baseResponse.SUCCESS);
    }
    catch (err) {
        logger.error(`App - saveTournamentResult Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}

exports.resetTournamentBracket = async function (competitionId){
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const resetTournamentBracketResult = await tournamentDao.resetTournamentBracket(connection, competitionId);

        connection.release();
        return response(baseResponse.SUCCESS);
    }
    catch (err) {
        logger.error(`App - saveTournamentResult Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}