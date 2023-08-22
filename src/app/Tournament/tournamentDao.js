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
         SELECT *
         FROM Tournament_Node
         WHERE competition_id = ?;
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
         WHERE competition_id = 1
         ) AS ranked ON tch.team_id = ranked.team_id
         SET tch.rank = ranked.ranking
         where competition_id = 1;
         `;
  try{
    await connection.query(getPointQuery, [competitionId]);
    await connection.query(saveTournamentResultQuery, [competitionId]);

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


module.exports = {
  createTournamentBracket,
  getTournamentEntryTeam,
  recordWinner,
  saveTournamentResult,
  getTournamentTeamName
};


////////////////////////////

// /*
// // 모든 대회 조회
// async function getCompetition(connection) {
//   const getCompetitionListQuery = `
//          SELECT * 
//          FROM Competition;
//          `;
//   const [getTournamentTeamNameRows] = await connection.query(getCompetitionListQuery);
//   return getTournamentTeamNameRows;
// }

// // id로 특정 대회 조회
// async function getCompetitionById(connection, id) {
//   const getCompetitionIdQuery = `
//          SELECT * 
//          FROM Competition
//          WHERE id = ?;
//          `;
//   let num = parseInt(id);
//   const [getTournamentTeamNameRows] = await connection.query(getCompetitionIdQuery, num);
//   return getTournamentTeamNameRows;
// }

// // 대회 등록
// async function createCompetition(connection, createCompetitionParams) {
//   // host_id는 로그인 기능 구현 후 추가하기
//   const createCompetitionQuery = `
//          INSERT INTO Competition (competition_title, competition_content, event, dead_date, qualification, 
//          prize, pre_date, final_date, poster_path, pdf_path,  created_at, updated_at)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
//          `;
//   const [getTournamentTeamNameRows] = await connection.query(createCompetitionQuery, createCompetitionParams);
//   // console.log('idrow : ',idRows);
//   // console.log("Competition Rows:", getTournamentTeamNameRows); // 이 줄 추가
//   return getTournamentTeamNameRows;
// }

// // id값을 입력해 db 수정
// async function updateCompetition(connection, competitionId, updateCompetitionParams) {
//   const updateCompetitionQuery = `
//         UPDATE Competition 
//         SET competition_title = ?, competition_content = ?, event = ?, dead_date = ?, qualification = ?, prize = ?,
//         pre_date = ?, final_date = ?, poster_path = ?, pdf_path = ?, updated_at = CURRENT_TIMESTAMP
//         WHERE id = ?;
//         `;
//   updateCompetitionParams.push(competitionId)
//   const [getTournamentTeamNameRows] = await connection.query(updateCompetitionQuery, updateCompetitionParams);
//   return getTournamentTeamNameRows;
// }

// // id값을 입력해 db 삭제
// async function deleteCompetition(connection, competitionId) {
//   const deleteCompetitionQuery = `
//         DELETE FROM Competition
//         WHERE id = ?
//         `;
//   const [getTournamentTeamNameRows] = await connection.query(deleteCompetitionQuery, competitionId);
//   return getTournamentTeamNameRows;
// }

// // Id값을 입력해 db에 저장된 사진 경로 반환
// async function getPosterPath(connection, competitionId) {
//   const getPosterPathQuery = `
//         SELECT poster_path 
//         FROM Competition 
//         WHERE id = ?
//         `;
//   const [getTournamentTeamNameRows] = await connection.query(getPosterPathQuery, competitionId);
//   // console.log("Competition Rows:", getTournamentTeamNameRows); // 이 줄 추가
//   return getTournamentTeamNameRows;
// }

// // Id값을 입력해 db에 저장된 pdf 경로 반환
// async function getPdfPath(connection, competitionId) {
//   const getPdfPathQuery = `
//         SELECT pdf_path 
//         FROM Competition 
//         WHERE id = ?
//         `;
//   const [getTournamentTeamNameRows] = await connection.query(getPdfPathQuery, competitionId);
//   return getTournamentTeamNameRows;
// }

// // 대회에 신청하면 Team 테이블에 팀명, 참가하는 대회id & Player 테이블에 선수 이름, 닉네임이 저장됨
// async function entryCompetitionTeam(connection, competitionId, entryCompetitionParams) {
//   const entryCompetitionTeamQuery = `
//   INSERT INTO Team (team_name, competition_id, created_at, updated_at)
//   VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
//   `;

//   const entryCompetitionPlayerQuery = `
//   INSERT INTO Player (team_id, nickname, isLeader, created_at, updated_at)
//   VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
//   `;
//   try {
    
//     const [team_name, ...nicknames] = entryCompetitionParams;
//     entryCompetitionTeamQueryParams = [team_name, competitionId];
//     await connection.query(entryCompetitionTeamQuery, entryCompetitionTeamQueryParams);

//     const result = await connection.query('SELECT LAST_INSERT_ID()');
//     const teamId = result[0][0]['LAST_INSERT_ID()'];

//     for (let i = 0; i < nicknames.length; i++) {
//       let isLeader = i === 0;
//       let entryCompetitionPlayerQueryParams = [
//         teamId,
//         nicknames[i],
//         isLeader,
//       ];
//       await connection.query(entryCompetitionPlayerQuery, entryCompetitionPlayerQueryParams);
//     }

//     return true;

//   } catch (error) {
//     throw error;
//   }
// }

// // id로 특정 대회 조회
// async function getgetTournamentTeamName(connection, id) {
//   const getgetTournamentTeamNameQuery = `
//          SELECT team_name 
//          FROM Team
//          WHERE competition_id = ?;
//          `;
//   let num = [id];
//   const [getTournamentTeamNameRows] = await connection.query(getgetTournamentTeamNameQuery, num);
//   return getTournamentTeamNameRows;
// }

// */