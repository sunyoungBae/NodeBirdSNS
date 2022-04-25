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