const { Model, DataTypes } = require("sequelize/types");
const { sequelize } = require(".");

Model.exports = (sequelize, DataTypes) => {
    const Image = sequelize.defind('Image', { // MySQL에는 posts 테이블 생성
        // 저장할 컬럼
        // id는 MySQL에서 자동으로 만들어주며, 기본적으로 들어있다.
        src: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
    }, {
        // 세팅 : 한글 + 이모티콘 저장
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    Image.associate = (db) => {};
    return Image;
}