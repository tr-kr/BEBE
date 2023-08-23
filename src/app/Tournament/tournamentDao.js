// 대진표 초기설정
async function createTournamentBracket(connection, competitionId) {
  const getTournamentTeamIdQuery = `
         SELECT id
         FROM Team
         where competition_id = ?;
         `;

  const createTournamentBracketQuery = `
         INSERT INTO Tournament_Node (competition_id, round, match_number, team1_id, team2_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
         `;

  const createTournamentEmptyBracketQuery = `
         INSERT INTO Tournament_Node (competition_id, round, match_number, created_at, updated_at)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
         `;


  const createTeamHistoryQuery = `
         INSERT INTO Team_Competition_History (competition_id, team_id, point, created_at, updated_at)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
         `;

  try {
    const teamIdResult = await connection.query(getTournamentTeamIdQuery, competitionId);
    const teamIdsArray = teamIdResult[0].map(row => row.id);
    
    for (const teamId of teamIdsArray) {
      await connection.query(createTeamHistoryQuery, [competitionId, teamId, 0]);
    }

    const pairedTeams = [];

    for (let i = 0; i < teamIdsArray.length; i += 2) {
      const team1_id = teamIdsArray[i];
      const team2_id = i + 1 < teamIdsArray.length ? teamIdsArray[i + 1] : null;
      pairedTeams.push([team1_id, team2_id]);
    }
  
    let i = 0;
    for (const [team1_id, team2_id] of pairedTeams) {
      await connection.query(createTournamentBracketQuery, [
        competitionId, 1, i, team1_id, team2_id
      ])
      i++;
    }

    await connection.query(createTournamentEmptyBracketQuery, [competitionId, 2, 0])
    await connection.query(createTournamentEmptyBracketQuery, [competitionId, 3, 0])

    return true;
  }
  catch (error){
    throw error;
  }
}

// 대진표 등록된 팀들 반환
async function getTournamentEntryTeam(connection, competitionId) {
  const getTournamentTeamNameQuery = `
         SELECT t.team_name, tch.*, tn.*
         FROM Team_Competition_History tch
         JOIN Team t ON tch.team_id = t.id
         LEFT JOIN Tournament_Node tn ON tn.competition_id = tch.competition_id
         WHERE tch.competition_id = ?;
         `;
  const [getTournamentTeamNameRows] = await connection.query(getTournamentTeamNameQuery, [competitionId]);
  return getTournamentTeamNameRows;
}


// 대진표 승리팀 처리
async function recordWinner(connection, competitionId, teamId, round, matchNumber){
  const isEven = matchNumber % 2 === 0;

  const teamColumnName = isEven ? 'team1_id' : 'team2_id';

  // 승리팀 winnser_id 업데이트
  // teamId, round, matchNumber
  const updateWinnerQuery = `
         UPDATE Tournament_Node
         SET winner_id = ?
         WHERE round = ? and match_number = ?;
         `;

  // 승리팀 진출처리
  // teamId, round++, 0
  const winningTeamAdvanceQuery = `
         UPDATE Tournament_Node
         SET ${teamColumnName} = ?
         WHERE round = ? and match_number = ?;
         `;

  try{
    const updateWinnerQueryParams = [teamId, round, matchNumber];
    const winningTeamAdvanceQueryParams = [teamId, ++round, 0];
    
    await connection.query(updateWinnerQuery, updateWinnerQueryParams);
    await connection.query(winningTeamAdvanceQuery, winningTeamAdvanceQueryParams);

    return true;
  }
  catch (error){
    throw error;
  }
}

// 대진표 확정하기
async function saveTournamentResult(connection, competitionId){
  // const getPointQueryParams = [round, competitionId, teamId];
  // 승점 처리
  // round, competitionId, matchNumber
  const getPointQuery = `
         UPDATE Team_Competition_History AS tch
         INNER JOIN (
         SELECT winner_id, MAX(round) AS max_round
         FROM Tournament_Node
         GROUP BY winner_id
         ) AS tn ON tch.team_id = tn.winner_id
         SET tch.point = CASE WHEN tch.point < tn.max_round THEN tn.max_round ELSE tch.point END
         WHERE tch.competition_id = ?;
         `;
   
  const saveTournamentResultQuery = `
         UPDATE Team_Competition_History AS tch
         JOIN (
         SELECT team_id, RANK() OVER (ORDER BY point DESC) AS ranking
         FROM Team_Competition_History
         WHERE competition_id = ?
         ) AS ranked ON tch.team_id = ranked.team_id
         SET tch.grade = ranked.ranking
         where competition_id = ?;
         `;
  try{
    await connection.query(getPointQuery, [competitionId]);
    await connection.query(saveTournamentResultQuery, [competitionId, competitionId]);

    return true;
  }
  catch (error){
    throw error;
  }
}

// teamId로 팀명검색
async function getTournamentTeamName(connection, teamId) {
  const getTournamentTeamNameQuery = `
         SELECT team_name
         FROM Team
         WHERE id = ?;
         `;
  const [getTournamentTeamNameRows] = await connection.query(getTournamentTeamNameQuery, [teamId]);
  return getTournamentTeamNameRows;
}

// competition_id로 대회결과반환
async function getTournamentRanking(connection, competitionId){
  const getTournamentRankingQuery = `
         SELECT t.team_name, tch.team_id, tch.grade
         FROM Team_Competition_History tch
         JOIN Team t ON tch.team_id = t.id
         WHERE tch.competition_id = ?;
         `;
  const [getTournamentRankingRows] = await connection.query(getTournamentRankingQuery, [competitionId]);
  return getTournamentRankingRows;
}

// competition_id 로 대진표 초기화
async function resetTournamentBracket(connection, competitionId){
  const resetTournamentBracketQuery = `
         DELETE FROM Tournament_Node 
         WHERE competition_id = ?;
  `;
  const [resetTournamentBracketRows] = await connection.query(resetTournamentBracketQuery, [competitionId]);
  return resetTournamentBracketRows;

}

module.exports = {
  createTournamentBracket,
  getTournamentEntryTeam,
  recordWinner,
  saveTournamentResult,
  getTournamentTeamName,
  getTournamentRanking,
  resetTournamentBracket
};

