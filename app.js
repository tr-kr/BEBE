const express = require('express')
const app = express();
const mysql = require('mysql');

const server = app.listen(3000, function(){
    console.log("Express Serve Start Port 3000!!");
    //res.send('Hello World');
    
})

app.get('', function(req,res){
    res.send('index입니다 : hostIP:' + req.hostname + ', My IP:' + req.ip);
    console.log('IP:' + req.ip + ', index접근');
})
//라우팅 진행하기
// localhost:3000/test 접속할때마다 Hello Wolrd 출력함



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/test/:id', function(req, res){
    const userName = req.params.id;

    console.log('Hello World '+ userName);

    //DB연결
    const connection = mysql.createConnection(
        {
            host: 'carrot-carrot-umc.cemtng3zpmew.us-east-2.rds.amazonaws.com',
            port: 3306,
            user: 'admin',
            password: 'wldnjs0102',
            database: 'carrot_backend'
        }
    )
    
    connection.connect();
    //2. userInfo 테이블에 있는 정보 가져오기
    const getUserQuery = `SELECT id, nick, id2 FROM USER WHERE nick = '${userName}';`
    const getUserResult = connection.query(getUserQuery, function(err, rows, fields){
        if(!getUserResult){
            res.send("회원정보가 조회되지 않습니다.");
        }
        else{
            console.log(rows[0]);
            
            res.send(rows[0]);
        }
    });
});




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/signup', function(req, res){
    //회원 가입
    //1. DB연결
   // const id = req.params.id;
    console.log('사인업 들어옴');
    const connection = mysql.createConnection(
        {
            host: 'carrot-carrot-umc.cemtng3zpmew.us-east-2.rds.amazonaws.com',
            port: 3306,
            user: 'admin',
            password: 'wldnjs0102',
            database: 'carrot_backend'
        }
    )
    connection.connect();
        //쿼리문 수행

    const postUserQuery = `INSERT INTO USER VALUES(5, '5new_nick', 5);`
    const postUserResult = connection.query(postUserQuery, function(err, rows, fields){
        console.log(err);
        console.log(rows);

        if(err !== null){
            res.send(err);
        }
        res.send('회원가입ㅂ에 성공함 ㅊㅊ');
    });
})