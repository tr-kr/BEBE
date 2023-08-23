const jwtMiddleware = require("../../../config/jwtMiddleware");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const regexEmail = require("regex-email");
const { emit } = require("nodemon");
const tournamentProvider = require("./tournamentProvider");
const tournamentService = require("./tournamentService");

const views = require("../../../views/template");
const path = require('path');

/*
 * API No. 1
 * API Name :  대회 참여 팀 대진표 생성
 * [POST] /api/tournament/:competitionId/create
 */
exports.createTournamentBracket = async function (req, res) {

    competitionId = req.params.competitionId;

    const createTournamentBracketResponse = await tournamentService.createTournamentBracket(competitionId);

    return res.send(createTournamentBracketResponse);

};

/*
 * API No. 2
 * API Name : 토너먼트 대진표 참여팀 불러오기
 * [GET] /api/tournament/:competitionId  대회에 참여하는 모든 팀 정보 반환
 */
exports.getTournamentEntryTeam = async function (req, res) {
    const competitionId = req.params.competitionId;

    const getTournamentEntryTeamResponse = await tournamentProvider.getTournamentEntryTeam(competitionId);
    return res.send(response(baseResponse.SUCCESS, getTournamentEntryTeamResponse));
}

/*
 * API No. 3
 * API Name : 대진표 승리팀 처리
 * [POST] /api/tournament/:competitionId/:teamId/:round/:matchNumber  대진표 승리팀 처리
 */
exports.recordWinner = async function (req, res) {
    const { competitionId, teamId, round, matchNumber } = req.params;

    console.log(matchNumber);
    const recordWinnerResponse = await tournamentService.recordWinner(competitionId, teamId, round, matchNumber);
    return res.send(response(baseResponse.SUCCESS, recordWinnerResponse))
}

/*
 * API No. 4
 * API Name : 대진표 결과 저장
 * [GET] /api/tournament/:competitionId/result  토너먼트 종료 한 뒤, 대진표 결과를 저장
 */
exports.saveTournamentResult = async function (req, res) {
    const competitionId = req.params.competitionId;

    const saveTournamentResultResponse = await tournamentService.saveTournamentResult(competitionId);
    return res.send(response(baseResponse.SUCCESS, saveTournamentResultResponse));
}

/*
 * API No. 5
 * API Name : 팀 id로 팀명검색
 * [GET] /api/tournament/:teamId  
 */
exports.getTournamentTeamName = async function (req, res) {
    const teamId = req.params.teamId;

    const getTournamentTeamNameResponse = await tournamentProvider.getTournamentTeamName(teamId);
    return res.send(response(baseResponse.SUCCESS, getTournamentTeamNameResponse));
}

/*
 * API No. 6
 * API Name : 대회 번호로 최종순위 반환
 * [GET] /api/tournament/:competitionId/ranking  
 */
exports.getTournamentRanking = async function (req, res) {
    const competitionId = req.params.competitionId;

    const getTournamentRankingResponse = await tournamentProvider.getTournamentRanking(competitionId);
    return res.send(response(baseResponse.SUCCESS, getTournamentRankingResponse));
}


