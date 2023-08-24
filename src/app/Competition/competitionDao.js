// 모든 대회 조회
async function getCompetition(connection) {
  const getCompetitionListQuery = `
         SELECT * 
         FROM Competition;
         `;
  const [competitionEntryTeamRows] = await connection.query(getCompetitionListQuery);
  return competitionEntryTeamRows;
}

// id로 특정 대회 조회
async function getCompetitionById(connection, id) {
  const getCompetitionIdQuery = `
         SELECT * 
         FROM Competition
         WHERE id = ?;
         `;
  let num = parseInt(id);
  const [competitionEntryTeamRows] = await connection.query(getCompetitionIdQuery, num);
  return competitionEntryTeamRows;
}
/* competition_title, competition_content, event, qualification, prize, poster_path, pdf_path, recruit_period, competition_period, format, scale
(competition_title, competition_content, event, qualification,
          prize, poster_path, pdf_path, recruit_period, competition_period, format, scale,  created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

*/
// 대회 등록
async function createCompetition(connection, createCompetitionParams) {
  // host_id는 로그인 기능 구현 후 추가하기
  const createCompetitionQuery = `
         INSERT INTO Competition (competition_title, competition_content, event, qualification,
          prize, recruit_period, competition_period, format, scale,  created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
         `;
  const [competitionEntryTeamRows] = await connection.query(createCompetitionQuery, createCompetitionParams);
  // console.log('idrow : ',idRows);
  // console.log("Competition Rows:", competitionEntryTeamRows); // 이 줄 추가
  return competitionEntryTeamRows;
}

/*
SET competition_title = ?, competition_content = ?, event = ?, qualification = ?, prize = ?,
        poster_path = ?, pdf_path = ?, recruit_period = ?, competition_period = ?, format = ?, scale = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?;
*/
// id값을 입력해 db 수정
async function updateCompetition(connection, competitionId, updateCompetitionParams) {
  const updateCompetitionQuery = `
        UPDATE Competition 
        SET competition_title = ?, competition_content = ?, event = ?, qualification = ?, prize = ?,
        recruit_period = ?, competition_period = ?, format = ?, scale = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?;
        `;
  updateCompetitionParams.push(competitionId)
  const [competitionEntryTeamRows] = await connection.query(updateCompetitionQuery, updateCompetitionParams);
  return competitionEntryTeamRows;
}

// id값을 입력해 db 삭제
async function deleteCompetition(connection, competitionId) {
  const deleteCompetitionQuery = `
        DELETE FROM Competition
        WHERE id = ?
        `;
  const [competitionEntryTeamRows] = await connection.query(deleteCompetitionQuery, competitionId);
  return competitionEntryTeamRows;
}

// Id값을 입력해 db에 저장된 사진 경로 반환
async function getPosterPath(connection, competitionId) {
  const getPosterPathQuery = `
        SELECT poster_path 
        FROM Competition 
        WHERE id = ?
        `;
  const [competitionEntryTeamRows] = await connection.query(getPosterPathQuery, competitionId);
  // console.log("Competition Rows:", competitionEntryTeamRows); // 이 줄 추가
  return competitionEntryTeamRows;
}

// Id값을 입력해 db에 저장된 pdf 경로 반환
async function getPdfPath(connection, competitionId) {
  const getPdfPathQuery = `
        SELECT pdf_path 
        FROM Competition 
        WHERE id = ?
        `;
  const [competitionEntryTeamRows] = await connection.query(getPdfPathQuery, competitionId);
  return competitionEntryTeamRows;
}

// 대회에 신청하면 Team 테이블에 팀명, 참가하는 대회id & Player 테이블에 선수 이름, 닉네임이 저장됨
async function entryCompetitionTeam(connection, competitionId, entryCompetitionParams) {
  const entryCompetitionTeamQuery = `
  INSERT INTO Team (team_name, competition_id, created_at, updated_at)
  VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
  `;

  const entryCompetitionPlayerQuery = `
  INSERT INTO Player (team_id, email, isLeader, created_at, updated_at)
  VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
  `;
  try {
    
    const [team_name, ...emails] = entryCompetitionParams;
    entryCompetitionTeamQueryParams = [team_name, competitionId];
    await connection.query(entryCompetitionTeamQuery, entryCompetitionTeamQueryParams);

    const result = await connection.query('SELECT LAST_INSERT_ID()');
    const teamId = result[0][0]['LAST_INSERT_ID()'];

    for (let i = 0; i < emails.length; i++) {
      let isLeader = i === 0;
      let entryCompetitionPlayerQueryParams = [
        teamId,
        emails[i],
        isLeader,
      ];
      await connection.query(entryCompetitionPlayerQuery, entryCompetitionPlayerQueryParams);
    }

    return true;

  } catch (error) {
    throw error;
  }
}

// id로 특정 대회 조회
async function getCompetitionEntryTeam(connection, id) {
  const getCompetitionEntryTeamQuery = `
         SELECT team_name 
         FROM Team
         WHERE competition_id = ?;
         `;
  let num = [id];
  const [competitionEntryTeamRows] = await connection.query(getCompetitionEntryTeamQuery, num);
  return competitionEntryTeamRows;
}

module.exports = {
  getCompetition,
  getCompetitionById,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  getPosterPath,
  getPdfPath,
  entryCompetitionTeam,
  getCompetitionEntryTeam
};
