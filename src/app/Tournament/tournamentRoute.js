const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      let uploadPath = '';
      if (file.mimetype === 'application/pdf') {
          uploadPath = 'public/pdfs';
      } else if (file.mimetype.startsWith('image/')) {
          uploadPath = 'public/images';
          console.log(file.mimetype)
      }
      cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }); // multer 설정

module.exports = function (app) {
    const tournament = require('./tournamentController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    


/**
 * @swagger
 * tags:
 *   name: 대진표
 *   description: 대회 관련 API
 */

/**
 * @swagger
 * /api/tournament/{competitionId}/create:
 *   post:
 *     summary: 대회 참여 팀 대진표 생성
 *     tags: [대진표]
 *     parameters:
 *       - in: path
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 대진표를 생성할 대회의 ID
 *     responses:
 *       200:
 *         description: 대진표 생성 성공
 *       500:
 *         description: 서버 오류
 */
    app.post('/api/tournament/:competitionId/create', tournament.createTournamentBracket);


/**
 * @swagger
 * /api/tournament/{competitionId}:
 *   get:
 *     summary: 토너먼트 대진표 참여팀 불러오기
 *     tags: [대진표]
 *     parameters:
 *       - in: path
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 참여 팀을 불러올 대회의 ID
 *     responses:
 *       200:
 *         description: 대진표 참여팀 정보 반환 성공
 *       500:
 *         description: 서버 오류
 */
    app.get('/api/tournament/:competitionId', tournament.getTournamentEntryTeam);

/**
 * @swagger
 * /api/tournament/{competitionId}/{teamId}/{round}/{matchNumber}:
 *   post:
 *     summary: 대진표 승리팀 진출
 *     tags: [대진표]
 *     parameters:
 *       - in: path
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 승리팀을 처리할 대회의 ID
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 승리한 팀의 ID
 *       - in: path
 *         name: round
 *         required: true
 *         schema:
 *           type: integer
 *         description: 승리한 라운드 번호
 *       - in: path
 *         name: matchNumber
 *         required: true
 *         schema:
 *           type: integer
 *         description: 승리한 경기 번호
 *     responses:
 *       200:
 *         description: 대진표 승리팀 처리 성공
 *       500:
 *         description: 서버 오류
 */
    app.post('/api/tournament/:competitionId/:teamId/:round/:matchNumber', tournament.recordWinner);

   /**
 * @swagger
 * /api/tournament/{competitionId}/result:
 *   post:
 *     summary: 대진표 결과 저장
 *     tags: [대진표]
 *     parameters:
 *       - in: path
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 결과를 저장할 대회의 ID
 *     responses:
 *       200:
 *         description: 대진표 결과 저장 성공
 *       500:
 *         description: 서버 오류
 */

    app.post('/api/tournament/:competitionId/result', tournament.saveTournamentResult);

/**
 * @swagger
 * /api/team/{teamId}:
 *   get:
 *     summary: 팀 id로 팀명 검색
 *     tags: [대진표]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 팀명을 검색할 팀의 ID
 *     responses:
 *       200:
 *         description: 팀명 검색 성공
 *       500:
 *         description: 서버 오류
 */
    app.get('/api/team/:teamId', tournament.getTournamentTeamName);
};