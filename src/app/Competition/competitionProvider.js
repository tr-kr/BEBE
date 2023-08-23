const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const competitionDao = require("./competitionDao");

// Provider: Read 비즈니스 로직 처리

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


