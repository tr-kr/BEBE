// const storage = require('../../../index').storage;
// const multer = require('multer');
const multer = require('multer');
const path = require('path');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       const absolutePath = path.resolve(__dirname, 'public', 'images')
//       cb(null, 'public/images');
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + path.extname(file.originalname));
//       // console.log('Date.now : ', Date.now);
//       // console.log('extname : ', path.extname(file.originalname));
//     }
// });

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
    const competition = require('./competitionController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    
    app.get('/', competition.index);


/**
 * @swagger
 * /api/competition:
 *   get:
 *     tags:
 *       - 대회
 *     summary: 전체 대회 정보 반환
 *     parameters:
 *       - name: competitionId
 *         in: query
 *         description: 대회 ID (특정 대회 정보 반환 시 사용)
 *         required: false
 *         type: integer
 *     responses:
 *       200:
 *         description: 대회 정보 반환 성공
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Competition'
 * /api/competition/{competitionId}:
 *   get:
 *     tags:
 *       - 대회
 *     summary: 특정 대회 정보 반환
 *     parameters:
 *       - name: competitionId
 *         in: path
 *         description: 대회 ID
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: 대회 정보 반환 성공
 *         schema:
 *           $ref: '#/definitions/Competition'
 */
app.get('/api/competition', competition.getCompetition);

/**
 * @swagger
 * definitions:
 *   Competition:
 *     properties:
 *       id:
 *         type: integer
 *         description: 대회 ID
 *       title:
 *         type: string
 *         description: 대회 제목
 *       content:
 *         type: string
 *         description: 대회 내용
 *       event:
 *         type: string
 *         description: 대회 이벤트
 *       qualification:
 *         type: string
 *         description: 응모 자격
 *       prize:
 *         type: string
 *         description: 상금 정보
 *       recruit_period:
 *         type: string
 *         description: 모집 기간
 *       competition_period:
 *         type: string
 *         description: 대회 기간
 *       format:
 *         type: string
 *         description: 대회 형식
 *       scale:
 *         type: string
 *         description: 대회 참여 팀 수
 * 
 *       photo:
 *         type: array
 *         items:
 *           type: string
 *           format: uri
 *           description: 포스터 사진 URL
 */
    app.get('/api/competition/:competitionId', competition.getCompetition);



    /**
 * @swagger
 * /api/competition:
 *   post:
 *     tags:
 *       - 대회
 *     summary: 대회 등록
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: competition_title
 *         type: string
 *         description: 대회 제목
 *         required: true
 *       - in: formData
 *         name: competition_content
 *         type: string
 *         description: 대회 내용
 *         required: true
 *       - in: formData
 *         name: event
 *         type: string
 *         description: 대회 이벤트
 *         required: true
 *       - in: formData
 *         name: dead_date
 *         type: string
 *         format: date
 *         description: 응모 마감일
 *         required: true
 *       - in: formData
 *         name: qualification
 *         type: string
 *         description: 응모 자격
 *         required: true
 *       - in: formData
 *         name: prize
 *         type: string
 *         description: 상금 정보
 *         required: true
 *       - in: formData
 *         name: recruit_period
 *         type: string
 *         description: 모집 기간
 *         required: true
 *       - in: formData
 *         name: competition_period
 *         type: string
 *         description: 대회 기간
 *         required: true
 *       - in: formData
 *         name: format
 *         type: string
 *         description: 대회 형식
 *         required: true
 *       - in: formData
 *         name: scale
 *         type: string
 *         description: 대회 참여 팀 수
 *         required: true
 *       - in: formData
 *         name: photo
 *         type: file
 *         description: 포스터 사진 (최대 5개)
 *       - in: formData
 *         name: pdf
 *         type: file
 *         description: 관련 PDF 파일 (최대 5개)
 *     responses:
 *       200:
 *         description: 대회 등록 성공
 *       500:
 *         description: 내부 서버 오류
 */
    app.post('/api/competition', upload.fields([
      { name: 'photo', maxCount: 5 },
      { name: 'pdf', maxCount: 5 }
    ]), competition.registCompetition);
   
/**
 * @swagger
 * /api/competition/{competitionId}:
 *   put:
 *     tags:
 *       - 대회
 *     summary: 대회 정보 수정
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: competitionId
 *         in: path
 *         description: 대회 ID
 *         required: true
 *         type: integer
 *       - in: formData
 *         name: competition_title
 *         type: string
 *         description: 대회 제목
 *         required: true
 *       - in: formData
 *         name: competition_content
 *         type: string
 *         description: 대회 내용
 *         required: true
 *       - in: formData
 *         name: event
 *         type: string
 *         description: 대회 이벤트
 *         required: true
 *       - in: formData
 *         name: dead_date
 *         type: string
 *         format: date
 *         description: 응모 마감일
 *         required: true
 *       - in: formData
 *         name: qualification
 *         type: string
 *         description: 응모 자격
 *         required: true
 *       - in: formData
 *         name: prize
 *         type: string
 *         description: 상금 정보
 *         required: true
 *       - in: formData
 *         name: recruit_period
 *         type: string
 *         description: 모집 기간
 *         required: true
 *       - in: formData
 *         name: competition_period
 *         type: string
 *         description: 대회 기간
 *         required: true
 *       - in: formData
 *         name: format
 *         type: string
 *         description: 대회 형식
 *         required: true
 *       - in: formData
 *         name: scale
 *         type: string
 *         description: 대회 참여 팀 수
 *         required: true
 *       - in: formData
 *         name: photo
 *         type: file
 *         description: 포스터 사진 (최대 5개)
 *       - in: formData
 *         name: pdf
 *         type: file
 *         description: 관련 PDF 파일 (최대 5개)
 *     responses:
 *       200:
 *         description: 대회 정보 수정 성공
 *       500:
 *         description: 내부 서버 오류
 */
    app.put('/api/competition/:competitionId', upload.fields([
      { name: 'photo', maxCount: 5 },
      { name: 'pdf', maxCount: 5 }
    ]), competition.updateCompetition);
    
/**
 * @swagger
 * /api/competition/{competitionId}:
 *   delete:
 *     tags:
 *       - 대회
 *     summary: 대회 삭제
 *     parameters:
 *       - name: competitionId
 *         in: path
 *         description: 대회 ID
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: 대회 삭제 성공
 *       500:
 *         description: 내부 서버 오류
 */
    app.delete('/api/competition/:competitionId', competition.deleteCompetition);

/**
 * @swagger
 * /api/competition/entry/{competitionId}:
 *   post:
 *     tags:
 *       - 대회
 *     summary: 참가 팀 등록
 *     parameters:
 *       - name: competitionId
 *         in: path
 *         description: 대회 ID
 *         required: true
 *         type: integer
 *       - in: formData
 *         name: team_name
 *         type: string
 *         description: 팀 이름
 *         required: true
 *       - in: formData
 *         name: leader_nickname
 *         type: string
 *         description: 팀 리더 닉네임
 *         required: true
 *       - in: formData
 *         name: member1_nickname
 *         type: string
 *         description: 팀 멤버 1 닉네임
 *         required: true
 *       - in: formData
 *         name: member2_nickname
 *         type: string
 *         description: 팀 멤버 2 닉네임
 *         required: false
 *       - in: formData
 *         name: member3_nickname
 *         type: string
 *         description: 팀 멤버 3 닉네임
 *         required: false
 *       - in: formData
 *         name: member4_nickname
 *         type: string
 *         description: 팀 멤버 4 닉네임
 *         required: false
 *     responses:
 *       200:
 *         description: 참가 팀 등록 성공
 *       500:
 *         description: 내부 서버 오류
 */
    app.post('/api/competition/entry/:competitionId', upload.none(), competition.entryCompetitionTeam);



/**
 * @swagger
 * /api/competition/entry/{competitionId}:
 *   get:
 *     tags:
 *       - 대회
 *     summary: 대회 참가 팀 반환
 *     description: 주어진 대회 ID에 해당하는 참가 팀을 반환합니다.
 *     parameters:
 *       - name: competitionId
 *         in: path
 *         description: 대회 ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 성공적으로 대회 참가 팀 반환
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompetitionEntryResponse'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CompetitionEntryResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: SUCCESS
 *             message:
 *               type: string
 *               example: 대회 참가 팀을 성공적으로 가져왔습니다.
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CompetitionEntryTeam'
 *
 *     CompetitionEntryTeam:
 *       type: object
 *       properties:
 *         teamName:
 *           type: string
 *           example: Team A
 *         members:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Member 1", "Member 2"]
 */
    app.get('/api/competition/entry/:competitionId', competition.getCompetitionEntryTeam);

};