// 모든 대회 조회
async function getCompetition(connection) {
  const getCompetitionListQuery = `
         SELECT * 
         FROM Competition;
         `;
  const [competitionRows] = await connection.query(getCompetitionListQuery);
  return competitionRows;
}

// id로 특정 대회 조회
async function getCompetitionById(connection, id) {
  const getCompetitionIdQuery = `
         SELECT * 
         FROM Competition
         WHERE id = ?;
         `;
  let num = parseInt(id);
  const [competitionRows] = await connection.query(getCompetitionIdQuery, num);
  return competitionRows;
}

// 대회 등록
async function createCompetition(connection, createCompetitionParams) {
  // host_id는 로그인 기능 구현 후 추가하기
  const createCompetitionQuery = `
         INSERT INTO Competition (competition_title, competition_content, event, dead_date, qualification, 
         prize, pre_date, final_date, poster_path, pdf_path,  created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
         `;
  const [competitionRows] = await connection.query(createCompetitionQuery, createCompetitionParams);
  // console.log('idrow : ',idRows);
  // console.log("Competition Rows:", competitionRows); // 이 줄 추가
  return competitionRows;
}

// id값을 입력해 db 수정
async function updateCompetition(connection, competitionId, updateCompetitionParams){
  const updateCompetitionQuery = `
        UPDATE Competition 
        SET competition_title = ?, competition_content = ?, event = ?, dead_date = ?, qualification = ?, prize = ?,
        pre_date = ?, final_date = ?, poster_path = ?, pdf_path = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?;
        `;
  updateCompetitionParams.push(competitionId)
  const [competitionRows] = await connection.query(updateCompetitionQuery, updateCompetitionParams);
  return competitionRows;
}

// id값을 입력해 db 삭제
async function deleteCompetition(connection, competitionId){
  const deleteCompetitionQuery = `
        DELETE FROM Competition
        WHERE id = ?
        `;
  const [competitionRows] = await connection.query(deleteCompetitionQuery, competitionId);
  return competitionRows;
}

// Id값을 입력해 db에 저장된 사진 경로 반환
async function getPosterPath(connection, competitionId){
  const getPosterPathQuery = `
        SELECT poster_path 
        FROM Competition 
        WHERE id = ?
        `;
  const [competitionRows] = await connection.query(getPosterPathQuery, competitionId);
  // console.log("Competition Rows:", competitionRows); // 이 줄 추가
  return competitionRows;
}

// Id값을 입력해 db에 저장된 pdf 경로 반환
async function getPdfPath(connection, competitionId){
  const getPdfPathQuery = `
        SELECT pdf_path 
        FROM Competition 
        WHERE id = ?
        `;
  const [competitionRows] = await connection.query(getPdfPathQuery, competitionId);
  // console.log("Competition Rows:", competitionRows); // 이 줄 추가
  return competitionRows;
}

module.exports = {
  getCompetition,
  getCompetitionById,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  getPosterPath,
  getPdfPath
};


// // 공지 수정
// async function updateNotice(connection, updateNoticeParams) {
//   const updateNoticeQuery = `UPDATE notice SET noticeTitle = ?, noticeContents = ? where id = ?;`
//   const updateNoticeRow = await connection.query(updateNoticeQuery, updateNoticeParams);

//   return updateNoticeRow;
// }
// // 공지 삭제
// async function deleteNotice(connection, noticeId) {
//   const deleteNoticeQuery = `DELETE FROM notice where id = ?;`
//   const deleteNoticeRow = await connection.query(deleteNoticeQuery, noticeId);

//   return deleteNoticeRow;
// }


/*
// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, nickname 
                FROM UserInfo;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email, nickname 
                FROM UserInfo 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT id, email, nickname 
                 FROM UserInfo 
                 WHERE id = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO UserInfo(email, password, nickname)
        VALUES (?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT email, nickname, password
        FROM UserInfo 
        WHERE email = ? AND password = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, id
        FROM UserInfo 
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, id, nickname) {
  const updateUserQuery = `
  UPDATE UserInfo 
  SET nickname = ?
  WHERE id = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
  return updateUserRow[0];
}
*/