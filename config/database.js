const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'carrot-carrot-umc.cemtng3zpmew.us-east-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'wldnjs0102',
    database: 'TRKR'
});

module.exports = {
    pool: pool
};