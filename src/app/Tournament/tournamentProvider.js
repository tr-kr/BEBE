const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const tournamentDao = require("./tournamentDao");

// Provider: Read 비즈니스 로직 처리

// 대진표 등록된 팀들 반환
exports.getTournamentEntryTeam = async function(competitionId){
    const connection = await pool.getConnection(async (conn) => conn);
    const getTournamentTeamNameResult = await tournamentDao.getTournamentEntryTeam(connection, competitionId);
    connection.release();

    return getTournamentTeamNameResult;
};

// teamId로 팀명검색
exports.getTournamentTeamName = async function(teamId){
  const connection = await pool.getConnection(async (conn) => conn);
  const getTournamentTeamNameResult = await tournamentDao.getTournamentTeamName(connection, teamId);
  connection.release();

  return getTournamentTeamNameResult;
};




////////////////////////////////////

exports.retrieveCompetitionList = async function (competitionId) {
  if (!competitionId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const competitionListResult = await competitionDao.getCompetition(connection);
    connection.release();

    return competitionListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const competitionListResult = await competitionDao.getCompetitionById(connection, competitionId);
    connection.release();

    return competitionListResult;
  }
};

exports.retrieveCompetitionEntryTeamList = async function (competitionId) {
    const connection = await pool.getConnection(async (conn) => conn);
    console.log(competitionId);
    const competitionEntryTeamListResult = await competitionDao.getCompetitionEntryTeam(connection, competitionId);
    connection.release();

    return competitionEntryTeamListResult;
};

