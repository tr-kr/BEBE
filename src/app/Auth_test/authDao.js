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
                FROM User 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// account로 회원 조회
async function selectUserAccountTest(connection, account) {
  const selectUserAccountQuery = `
                SELECT account, nickname 
                FROM User
                WHERE account = ?;
                `;
  const [accountRows] = await connection.query(selectUserAccountQuery, account);
  return accountRows;
}
// nickname으로 회원 조회
async function selectUserNickname(connection, nickname) {
  const selectUserNicknameQuery = `
                SELECT account, nickname 
                FROM User
                WHERE nickname = ?;
                `;
  const [nicknameRows] = await connection.query(selectUserNicknameQuery, nickname);
  return nicknameRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT user_id, nickname, age, password, phone_number, email, created_at, update_at, discord_auth, riot_auth, school_auth 
                 FROM User 
                 WHERE id = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUser(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(email, password, name, nickname, birth, created_at, updated_at)
        VALUES ( ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 이메일인증
async function verifyEmail(connection, id) {
  const selectUserEmailQuery = `
                UPDATE User 
                SET emailVerified = true,
                updated_at = CURRENT_TIMESTAMP
                WHERE id = ?;
                `;
            
  await connection.query(`SET SQL_SAFE_UPDATES=0;`);
  //console.log('zz',email);
  const [emailRows] = await connection.query(selectUserEmailQuery, id);
  //console.log(emailRows);
  await connection.query(`SET SQL_SAFE_UPDATES=1;`);
  return emailRows[0];
}

// 학교이메일인증
async function verifySchool(connection, id, email) {
  const selectUserEmailQuery = `
                UPDATE User 
                SET school_auth = ?,
                updated_at = CURRENT_TIMESTAMP
                WHERE id = ?;
                `;
    console.log("다오",id, email);
  //await connection.query(`SET SQL_SAFE_UPDATES=0;`);
  //console.log('zz',email);
  const [emailRows] = await connection.query(selectUserEmailQuery, [email, id]);
  //console.log(emailRows);
  //await connection.query(`SET SQL_SAFE_UPDATES=1;`);
  return emailRows[0];
}

// 디스코드인증
async function verifyDiscord(connection, id, discord) {
  const selectUserDiscordQuery = `
                UPDATE User 
                SET discord_auth = ?,
                updated_at = CURRENT_TIMESTAMP
                WHERE id = ?;
                `;
            
 // await connection.query(`SET SQL_SAFE_UPDATES=0;`);
  //console.log('zz',email);
  const [discordRows] = await connection.query(selectUserDiscordQuery, [discord, id]);
  //console.log(emailRows);
  //await connection.query(`SET SQL_SAFE_UPDATES=1;`);
  return discordRows[0];
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
      update_at = CURRENT_TIMESTAMP
  WHERE id = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, nickname, password, password, id]);
  return updateUserRow[0];
}


module.exports = {
  selectUser,
  selectUserAccountTest,
  selectUserEmail,
  selectUserNickname,
  verifyEmail,
  verifySchool,
  verifyDiscord,
  selectUserId,
  insertUser,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
};