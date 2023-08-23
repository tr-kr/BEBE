const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const authDao = require("./authDao");
//로그인light
exports.getPwd = async function (email, password) {
  const connection = await pool.getConnection(async (conn) => conn);
  const pwdCheckResult = await authDao.getPwd(connection, email, password);
  connection.release();

  return pwdCheckResult;
};

//회원탈퇴light
exports.deleteuser = async function (useridx) {
  try {
    const deleteuserResult = await authProvider.deleteuser(useridx);
    return deleteuserResult;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

/*로그아웃light
exports.logout = async function (useridx) {
  const blacklistedTokens = new Set(); // 무효화된 토큰을 저장하는 Set

  exports.invalidateToken = function (token) {
    blacklistedTokens.blacklisted;

    add(token); // 토큰을 무효화 목록에 추가
  };

  exports.isTokenBlacklisted = function (token) {
    return blacklistedTokens.has(token); // 토큰이 무효화 목록에 있는지 확인
  };

  exports.logout = async function (useridx) {
    // JWT를 사용하는 경우, 사용자의 토큰을 무효화 목록에 추가하여 무효화
    const invalidatedTokens = getTokensForUser(useridx); // 여기서 로직을 대체해주세요

    invalidatedTokens.forEach((token) => {
      invalidate;
      invalidateToken(token); // invalidateToken을 호출하여 토큰을 무효화 목록에 추가
    });
  };
  return { message: "Logged out successfully" };
};

/* Provider: Read 비즈니스 로직 처리

exports.retrieveUserList = async function (email) {
  if (!email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUser(connection);
    connection.release();

    return userListResult;
  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUserEmail(connection, email);
    connection.release();

    return userListResult;
  }
};

//product 조회
exports.retrieveProductList = async function (idx) {
  if (!idx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const productListResult = await userDao.selectProduct(connection);
    connection.release();

    return productListResult;
  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const productListResult = await userDao.selectProductId(connection, idx);
    connection.release();

    return productListResult;
  }
};

exports.retrieveUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserId(connection, userId);

  connection.release();

  return userResult[0];
};

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
    connection,
    selectUserPasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};*/
