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

//////////////////////////////////////////////////////////////////////////////////////

/*
 * API No. 1, 2
 * API Name : 대회 정보 반환
 * [GET] /api/competitions/                  전체 대회 정보 반환
 * [GET] /api/competitions/:competitionId    특정 대회 정보 반환
 */
exports.getCompetition = async function (req, res) {
    const id = req.params.competitionId;

    if (!id) {
        // 대회 목록 전체 조회
        const competitionResultList = await tournamentProvider.retrieveCompetitionList();
        return res.send(response(baseResponse.SUCCESS, competitionResultList));
    } else {
        // 특정 대회 조회
        const competitionResultListById = await tournamentProvider.retrieveCompetitionList(id);
        return res.send(response(baseResponse.SUCCESS, competitionResultListById));
    }
}

/*
 * API No. 3
 * API Name : 대회 등록
 * [POST] /api/competition
 */
exports.registCompetition = async function (req, res) {
    try {
        const { competition_title, competition_content, event, dead_date, qualification, prize, pre_date, final_date } = req.body;
        // const poster_path = req.file.path;
        const poster_path = req.files['photo'] ? req.files['photo'].map(photo => photo.path).join(',') : '';
        const pdf_path = req.files['pdf'] ? req.files['pdf'].map(pdf => pdf.path).join(',') : '';

        const createCompetitionResponse = await tournamentService.createCompetition(
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
 * API No. 4
 * API Name : 대회 수정
 * [PUT] /api/competition/:competitionId
 */
exports.updateCompetition = async function (req, res) {
    competitionId = req.params.competitionId;
    const { competition_title, competition_content, event, dead_date, qualification, prize, pre_date, final_date } = req.body;

    //const poster_path = req.file.path;
    const poster_path = req.files['photo'] ? req.files['photo'].map(photo => photo.path).join(',') : '';
    const pdf_path = req.files['pdf'] ? req.files['pdf'].map(pdf => pdf.path).join(',') : '';

    const updateCompetitionResponse = await tournamentService.updateCompetition(
        competitionId, competition_title, competition_content, event, dead_date, qualification, prize, pre_date, final_date, poster_path, pdf_path);

    return res.send(updateCompetitionResponse);
};

/*
 * API No. 5
 * API Name : 대회 삭제
 * [DELETE] /api/competition/:competitionId
 */
exports.deleteCompetition = async function (req, res) {
    competitionId = req.params.competitionId;

    const deleteCompetitionResponse = await tournamentService.deleteCompetition(competitionId);

    return res.send(deleteCompetitionResponse);
};


/*
 * API No. 6
 * API Name : 대회 참가 팀 등록
 * [POST] /api/competition/entry/:competitionId
 */
exports.entryCompetitionTeam = async function (req, res) {
    const { team_name, leader_nickname, member1_nickname, member2_nickname, member3_nickname, member4_nickname } = req.body;
    competitionId = req.params.competitionId;

    entryCompetitionParams = [team_name, leader_nickname, member1_nickname, member2_nickname, member3_nickname, member4_nickname];

    const entryCompetitionTeamResponse = await tournamentService.entryCompetitionTeam(competitionId, entryCompetitionParams);

    return res.send(entryCompetitionTeamResponse);
}

/*
 * API No. 7
 * API Name : 대회 참가 팀 반환
 * [GET] /api/competition/entry/:competitionId
 */
exports.getCompetitionEntryTeam = async function (req, res) {
    competitionId = req.params.competitionId;

    const competitionResultList = await tournamentProvider.retrieveCompetitionEntryTeamList(competitionId);
    return res.send(response(baseResponse.SUCCESS, competitionResultList));
}