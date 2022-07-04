const { Model, DataTypes } = require("sequelize/types");
const { sequelize } = require(".");

Model.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.defind('Hashtag', { // MySQL에는 posts 테이블 생성
        // 저장할 컬럼
        // id는 MySQL에서 자동으로 만들어주며, 기본적으로 들어있다.
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    }, {
        // 세팅 : 한글 + 이모티콘 저장
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });
    Hashtag.associate = (db) => {};
    return Hashtag;
}