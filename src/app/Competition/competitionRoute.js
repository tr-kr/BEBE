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

    // 공지 반환
    app.get('/api/competition', competition.getCompetition);

    // id값을 지정해서 특정 공지 반환
    app.get('/api/competition/:competitionId', competition.getCompetition);

    // 공지 추가, maxCount 값을 조절해서 최대로 업로드 할 pdf, photo 개수 조절
    app.post('/api/competition', upload.fields([
      { name: 'photo', maxCount: 3 },
      { name: 'pdf', maxCount: 3 }
    ]), competition.registCompetition);
   

    // id값을 지정해서 공지 수정
    app.put('/api/competition/:competitionId', upload.fields([
      { name: 'photo', maxCount: 3 },
      { name: 'pdf', maxCount: 3 }
    ]), competition.updateCompetition);
    
    // id값을 지정해서 공지 삭제
    app.delete('/api/competition/:competitionId', competition.deleteCompetition);
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