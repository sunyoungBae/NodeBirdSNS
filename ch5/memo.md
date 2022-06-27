# 노드로 서버 구동하기
> Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.
>
> 노드는 서버가 아니다. javascirpt 를 실행해주는 도구이다.
>
> 노드를 사용할 때 `http` 모듈이 서버 역할을 한다.

### 프론트 서버와 백엔드 서버

#### 프론트 서버
* server side rendering 담당
* `next`를 사용해 서버를 띄움
  * `next`는 `node`를 사용해 서버를 띄움

#### 백엔드 서버
* api 제공
* `node`를 사용해 서버를 올린다.
  * `node` : V8엔진을 사용해 Javascript 코드를 실행하는 것. `node`가 서버는 아니다.
    * 모듈을 사용해 서버를 띄움(`http`)

#### 프론트 서버와 백엔드 서버를 분리하는 이유?
* 대규모 앱이 되었을 때를 대비
* 특정 기능에 데이터가 몰릴 때
  * 분리  : 각 기능별로 서버를 나누어서 그 기능만 서버 여러대를 늘리는 방식으로 해결.
  * 분리X : 한 컴퓨터에 여러 기능의 서버를 두면 스케일링할 때 트래픽이 몰린 특정 기능이 아닌 모든 기능이 복사되므로 비효율적. 컴퓨터 자원 낭비.

### 서버 실행하기
예제 : app.js 파일
```javascript
const http = require('http');
const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    // 기본 방식 :  요청 method, url마다 분기를 해줘야한다.
    //              추후 이부분은 express를 사용해서 정리 예정
    if(req.method === 'GET') {
        if(req.url === '/api/posts') {}
    } else if(req.method === 'POST') {
        if(req.url === '/api/posts') {}
    } else if(req.method === 'DELETE') {
        if(req.url === '/api/posts') {}
    }
    res.write('<h1>Hello node</h1>'); // markdown도 사용 가능
    res.write('Hello node');
    res.end('Hello node');
});
server.listen(3065, () => { // 서버 실행 후 실행되는 콜백
    console.log('서버 실행 중');
});
```
### 실행 커맨드
`node app.js`

# 익스프레스로 라우팅하기 : request method, url 분기 개선
위 코드처럼 기본 노드 코드를 사용하면 요청 method, url마다 분기를 해줘야한다.
이를 개선하기위해 익스프레스를 사용한다.

설치 : `npm i express`

예제 : app.js 파일
```javascript
const express = require('express');
const app = express();

// 주소창으로 요청하면 get 요청
// 요청 method : get
// 요청 url : /
app.get('/', (req, res) => {
    res.send('hello express');
});

// 요청 method : get
// 요청 url : /posts
// json 객체 응답. 데이터는 보통 json으로 표현
app.get('/posts', (req, res) => {
    res.json([
        {id: 1, content: 'hello'},
        {id: 2, content: 'hello2'},
        {id: 3, content: 'hello3'},
    ]);
});

// 요청 method : post
// 요청 url : /posts
app.post('/posts', (req, res) => {
    res.json({id: 1, content: 'hello'});
});

// 요청 method : delete
// 요청 url : /posts
app.delete('/posts', (req, res) => {
    res.send('hello api');
});

app.listen(3065, () => {
    console.log('서버 실행 중');
});
```

### request 종류와 의미
<table>
    <tr>
        <td>요청 종류</td>
        <td>요청 의미</td>
        <td>요청 방법</td>
    </tr>
    <tr>
        <td>get</td>
        <td>가져오다</td>
        <td>브라우저 주소창으로 요청</td>
    </tr>
    <tr>
        <td>post</td>
        <td>생성하다</td>
        <td rowspan=6>js 코드(axis)나 postman같은 프로그램을 이용해 요청해야한다.</td>
    </tr>
    <tr>
        <td>put</td>
        <td>전체 수정</td>
    </tr>
    <tr>
        <td>delete</td>
        <td>제거하다</td>
    </tr>
    <tr>
        <td>patch</td>
        <td>부분 수정</td>
    </tr>
    <tr>
        <td>options</td>
        <td>찔러보기. 요청보낼 수 있는지 확인용.</td>
    </tr>
    <tr>
        <td>head</td>
        <td>헤더만 가져오기.(헤더/바디)</td>
    </tr>
</table>

# 익스프레스 라우터 분리하기 : request url이 동일한 부분은 파일로 분리
요청 url이 겹치는 것을 라우터로 분리
1. routes 폴더 생성
2. 주소가 겹치는 것을 파일로 분리

#### 예제
app.js
```javascript
const express = require('express');
const postRouter = require('./routes/post');    // post파일의 라우터 가져오기
const app = express();

app.get('/', (req, res) => {
    res.send('hello express');
});

// 첫번째 매개 변수 : 중복되는 url prefix
app.use('/post', postRouter);

app.listen(3065, () => {
    console.log('서버 실행 중');
});
```

post.js
```javascript
const express = require('express');

const router = express.Router();
// json 객체 응답. 데이터는 보통 json으로 표현
router.get('/', (req, res) => { // GET /post
    res.json([
        {id: 1, content: 'hello'},
        {id: 2, content: 'hello2'},
        {id: 3, content: 'hello3'},
    ]);
});

router.post('/', (req, res) => { // POST /post
    res.json({id: 1, content: 'hello'});
});

router.delete('/', (req, res) => { // DELETE /post
    res.send('hello api');
});

module.exports = router;
```

# MySQL과 시퀄라이즈 연결하기
참고 링크 : https://thebook.io/080229/ch07/02/01/
* Node.js 교과서 > 7.2.1 윈도

다운로드(8버전)
* MySQL Community Server
* MySQL Workbench

### 시퀄라이즈 설치
`npm i sequelize sequelize-cli mysql2`
* mysql2 : `node`와 `MySQL`을 연결해주는 driver
* sequelize : javascript로 SQL을 조작할 수 있게 해주는 라이브러리(SQL언어를 몰라도)

### 시퀄라이즈 세팅
`npx sequelize init`
* config, midgrations, models, seeders 폴더가 생성됨
* config/config.json에서 사용할 데이터 베이스의 값을 설정
  * 개발, 테스트, 배포 데이터 베이스 설정을 따로 할 수 있음
* models/index.js
  * fs까지의 내용을 지우고 아래 코드를 추가
    ```javascirpt
    'use strict';
    
    const Sequelize = require('sequelize');
    const env = process.env.NODE_ENV || 'development';
    const config = require('../config/config')[env];  // config/config.json 객체에 접근. 기본값은 development
    const db = {};
    
    // sequelize가 mysql2를 사용해 node와 MySQL을 연결시켜준다.
    const sequelize = new Sequelize(config.database, config.username, config.password, config);
    
    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
    
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    
    module.exports = db;
    ```

