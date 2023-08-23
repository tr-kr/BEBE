const jwtMiddleware = require("../../../config/jwtMiddleware");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const regexEmail = require("regex-email");
const { emit } = require("nodemon");
const competitionProvider = require("./competitionProvider");
const competitionService = require("./competitionService");

const views = require("../../../views/template");
const path = require('path');

exports.uploadImage = async function (req, res) {
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
exports.index = async function (req, res) {
    const html = views.HTML();
    res.send(html);
}

/*
 * API No. 1, 2
 * API Name : 대회 정보 반환
 * [GET] /api/competitions/                  전체 대회 정보 반환
 * [GET] /api/competitions/:competitionId    특정 대회 정보 반환
 */
exports.getCompetition = async function (req, res) {
    const competitionId = req.params.competitionId;

    if (!competitionId) {
        // 대회 목록 전체 조회
        const competitionResultList = await competitionProvider.retrieveCompetitionList();
        return res.send(response(baseResponse.SUCCESS, competitionResultList));
    } else {
        // 특정 대회 조회
        const competitionResultListById = await competitionProvider.retrieveCompetitionList(competitionId);
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
        const { competition_title, competition_content, event, qualification, prize,  recruit_period, competition_period, format, scale } = req.body;
        // const poster_path = req.file.path;
        const poster_path = req.files['photo'] ? req.files['photo'].map(photo => photo.path).join(',') : '';
        const pdf_path = req.files['pdf'] ? req.files['pdf'].map(pdf => pdf.path).join(',') : '';

        const createCompetitionResponse = await competitionService.createCompetition(
            competition_title, competition_content, event, qualification,
            prize, poster_path, pdf_path, recruit_period, competition_period, format, scale);

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
    const { competition_title, competition_content, event, qualification, prize,  recruit_period, competition_period, format, scale } = req.body;

    //const poster_path = req.file.path;
    const poster_path = req.files['photo'] ? req.files['photo'].map(photo => photo.path).join(',') : '';
    const pdf_path = req.files['pdf'] ? req.files['pdf'].map(pdf => pdf.path).join(',') : '';

    const updateCompetitionResponse = await competitionService.updateCompetition(
        competitionId, competition_title, competition_content, event, qualification,
        prize, poster_path, pdf_path, recruit_period, competition_period, format, scale);

    return res.send(updateCompetitionResponse);
};

/*
 * API No. 5
 * API Name : 대회 삭제
 * [DELETE] /api/competition/:competitionId
 */
exports.deleteCompetition = async function (req, res) {
    competitionId = req.params.competitionId;

    const deleteCompetitionResponse = await competitionService.deleteCompetition(competitionId);

    return res.send(deleteCompetitionResponse);
};


/*
 * API No. 6
 * API Name : 대회 참가 팀 등록
 * [POST] /api/competition/entry/:competitionId
 */
exports.entryCompetitionTeam = async function (req,res) {
    const {
        team_name,
        leader_nickname,
        member1_nickname = null,
        member2_nickname = null,
        member3_nickname = null,
        member4_nickname = null
      } = req.body;

    competitionId = req.params.competitionId;
    
    entryCompetitionParams = [team_name, leader_nickname, member1_nickname, member2_nickname, member3_nickname, member4_nickname];

    const entryCompetitionTeamResponse = await competitionService.entryCompetitionTeam(competitionId, entryCompetitionParams);

    return res.send(entryCompetitionTeamResponse);
}

/*
 * API No. 7
 * API Name : 대회 참가 팀 반환
 * [GET] /api/competition/entry/:competitionId
 */
exports.getCompetitionEntryTeam = async function (req,res) {
    competitionId = req.params.competitionId;
    
    const competitionResultList = await competitionProvider.retrieveCompetitionEntryTeamList(competitionId);
    return res.send(response(baseResponse.SUCCESS, competitionResultList));
}
