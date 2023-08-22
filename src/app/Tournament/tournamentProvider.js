const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const tournamentDao = require("./tournamentDao");

// Provider: Read 비즈니스 로직 처리

// 대진표 등록된 팀들 반환
exports.getTournamentEntryTeam = async function (competitionId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getTournamentTeamNameResult = await tournamentDao.getTournamentEntryTeam(connection, competitionId);
  connection.release();

  return getTournamentTeamNameResult;
};

// teamId로 팀명검색
exports.getTournamentTeamName = async function (teamId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getTournamentTeamNameResult = await tournamentDao.getTournamentTeamName(connection, teamId);
  connection.release();

  return getTournamentTeamNameResult;
};

// 대회 번호로 최종순위 반환
exports.getTournamentRanking = async function (competitionId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getTournamentRankingResult = await tournamentDao.getTournamentRanking(connection, competitionId);
  connection.release();

  return getTournamentRankingResult;
};
