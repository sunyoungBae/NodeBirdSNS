const express = require('express');
const postRouter = require('./routes/post');
const app = express();

// 주소창으로 요청하면 get 요청
// 요청 method : get
// 요청 url : 첫번째 파라미터
app.get('/', (req, res) => {
    res.send('hello express');
});

// post가 중복되는 것을 prefix
app.use('/post', postRouter);

app.listen(3065, () => {
    console.log('서버 실행 중');
});