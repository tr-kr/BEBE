// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, nickname 
                FROM User;
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
                 SELECT name, nickname, password, email, created_at, updated_at, discord_auth, riot_auth, school_auth, played_competition, played_match, win, lose, birth, emailVerified
                 FROM User 
                 WHERE id = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// userId로 참가했던 대회들 불러오기
async function selectPlayList(connection, userId) {
  const selectPlayList = `
                 SELECT competition_id, ranking
                 FROM Team_Competition_History
                 WHERE team_id IN (SELECT team_id
                  FROM Player
                  WHERE user_id = ?)
                 `;
  const [userRow] = await connection.query(selectPlayList, userId);
  return userRow;
}

// userId로 개최했던 대회들 불러오기
async function selectHostList(connection, userId) {
  const selectHostList = `
                 SELECT id
                 FROM Competition
                 WHERE host_id = ?
                 `;
  const [userRow] = await connection.query(selectHostList, userId);
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


async function updateUserInfo(connection, id, nickname, password) {
  const updateUserQuery = `
  UPDATE User 
  SET nickname = IF(? IS NOT NULL, ?, nickname),
      password = IF(? IS NOT NULL, ?, password),
      updated_at = CURRENT_TIMESTAMP
  WHERE id = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, nickname, password, password, id]);
  return updateUserRow[0];
}


module.exports = {
  selectUser,
  selectUserEmail,
  selectUserId,
  selectPlayList,
  selectHostList,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,

};