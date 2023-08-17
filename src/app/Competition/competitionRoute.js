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
 *       dead_date:
 *         type: string
 *         format: date
 *         description: 응모 마감일
 *       qualification:
 *         type: string
 *         description: 응모 자격
 *       prize:
 *         type: string
 *         description: 상금 정보
 *       pre_date:
 *         type: string
 *         format: date
 *         description: 예선 일자
 *       final_date:
 *         type: string
 *         format: date
 *         description: 본선 일자
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
 *         name: pre_date
 *         type: string
 *         format: date
 *         description: 예선 일자
 *         required: true
 *       - in: formData
 *         name: final_date
 *         type: string
 *         format: date
 *         description: 본선 일자
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
 *         name: pre_date
 *         type: string
 *         format: date
 *         description: 예선 일자
 *         required: true
 *       - in: formData
 *         name: final_date
 *         type: string
 *         format: date
 *         description: 본선 일자
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

};

// app.post('/api/competition', upload.single('photo'), competition.registCompetition);

// 0. 테스트 API
// app.get('/app/test', user.getTest)
    
// // 1. 유저 생성 (회원가입) API
// app.post('/app/users', user.postUsers);

// // 2. 유저 조회 API (+ 검색)
// app.get('/app/users',user.getUsers); 

// // 3. 특정 유저 조회 API
// app.get('/app/users/:userId', user.getUserById);

// // TODO: After 로그인 인증 방법 (JWT)
// // 로그인 하기 API (JWT 생성)
// app.post('/app/login', user.login);

// // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
// app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)

// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API