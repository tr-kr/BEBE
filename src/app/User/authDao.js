/* 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT pw, userName 
                FROM UserTB;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT pw, userName 
                FROM UserTB 
                WHERE pw = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT idx, pw, userName 
                 FROM UserTB 
                 WHERE idx = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// product 전체 조회
async function selectProduct(connection) {
  const selectProductIdQuery = `
                 SELECT idx, pdTitle, pdContents, pdCategory, price 
                 FROM productTB ;
                 `;
  const [userRow] = await connection.query(selectProductIdQuery);
  return userRow;
}

// product id로 조회
async function selectProductId(connection, idx) {
  const selectProductIdQuery = `
                 SELECT pdTitle, pdContents, pdCategory, price 
                 FROM productTB 
                 WHERE idx = ?;
                 `;
  const [userRow] = await connection.query(selectProductIdQuery, idx);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO UserTB(pw, password, userName)
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
        SELECT pw, userName, password
        FROM UserTB 
        WHERE pw = ? AND password = ?;`;
  const selectUserPasswordRow = await connection.query(
    selectUserPasswordQuery,
    selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, idx
        FROM UserTB 
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
    selectUserAccountQuery,
    email
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, id, nickname) {
  const updateUserQuery = `
  UPDATE UserTB
  SET userName = ?
  WHERE idx = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
  return updateUserRow[0];
}*/

/*module.exports = {
  selectUser,
  selectUserEmail,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  selectProduct,
  selectProductId,
};*/
