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
    
    // 참여팀 접수 마감이 끝나면, 버튼을 누르던가 해서 competitionId에 해당하는 모든 참여팀을 tournamentTeam 테이블에 저장
    app.post('/api/tournament/:competitionId/create', tournament.createTournamentBracket);

    // 토너먼트 참여팀 불러오기
    app.get('/api/tournament/:competitionId', tournament.getTournamentEntryTeam);

    // 대진표 승리팀 진출
    app.post('/api/tournament/:competitionId/:teamId/:round/:matchNumber', tournament.recordWinner);

    // 대진표 결과 저장
    app.post('/api/tournament/:competitionId/result', tournament.saveTournamentResult);

    // teamId로 팀명검색
    app.get('/api/team/:teamId', tournament.getTournamentTeamName);
};