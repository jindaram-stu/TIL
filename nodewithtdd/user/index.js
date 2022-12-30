const express = require('express');
const app = express();
const morgan = require('morgan');
let users = [
    {id:1, name : 'alice'},
    {id:2, name : 'bek'},
    {id:3, name : 'chris'},
    {id:4, name : 'micky'}
];

app.use(morgan('dev'))
app.use(express.json());

// 회원 전체 조회
app.get('/users', (req, res) => {
    req.query.limit = req.query.limit || 10; // 단축평가
    const limit = parseInt(req.query.limit, 10);
    if (Number.isNaN(limit)) {
        return res.status(400).end();
    }
    res.json(users.slice(0,limit));
});

// 회원 조회
app.get('/users/:id', (req, res) => {
    const paramId = parseInt(req.params.id, 10);
    if (Number.isNaN(paramId)) return res.status(400).end(); // 숫자가 아닌 경우 400 응답
    const findUserId = users.filter((user) => user.id === paramId)[0];
    if (!findUserId) return res.status(404).end(); // 찾을 수 없는 경우 404 응답
    res.json(findUserId).status(200).end();
})

// 회원 삭제
app.delete('/users/:id', (req, res) => {
    const paramId = parseInt(req.params.id, 10);
    if (Number.isNaN(paramId)) return res.status(400).end(); // 숫자가 아닌 경우 400 응답
    
    const deleteUser = users.filter((user) => user.id === paramId)[0];

    if (!deleteUser) {
        return res.status(404).end();
    }

    users.splice(users.indexOf(deleteUser), 1);
    res.status(204).end();
})

// 회원 추가
app.post('/users', (req, res) => {
    const name = req.body.name;
    if (!name) return res.status(400).end(); // name 파라미터 누락 시 400 반환
    for (const user of users) {
        if (user.name === name) {
            return res.status(409).end();
        }
    }
    
    const newId = users[users.length - 1].id + 1;
    const user = {id : newId, name : name}
    users.push(user);
    res.json(user).status(201).end();
})

// 회원 수정
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    console.log(`id = ${id}`);
    
    const changeName = req.body.name;

    // id가 정수가 아닌 경우
    if (Number.isNaN(id)) return res.status(400).end(); 

    // name 파라미터가 없는 경우
    if (!changeName) return res.status(400).end();

    // 존재하지 않는 id의 유저일 경우
    const isNotExistUser = users.filter((user) => user.id === id).length;
    if (isNotExistUser == 0) return res.status(404).end();

    // 이름이 중복일 경우
    const isNotExistUserName = users.filter((user) => user.name === changeName).length;
    if (isNotExistUserName != 0) return res.status(409).end();

    // 성공 시
    const newUsers = users.filter((user) => user.id != id);
    const changeUser = {id : id, name : changeName};
    newUsers.push(changeUser);
    users = newUsers;
    
    res.json(changeUser).status(200).end();
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;
