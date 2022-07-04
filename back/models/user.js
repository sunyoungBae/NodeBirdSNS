const { Model, DataTypes } = require("sequelize/types");
const { sequelize } = require(".");

Model.exports = (sequelize, DataTypes) => {
    const User = sequelize.defind('User', { // MySQL에는 users 테이블 생성
        // 저장할 컬럼
        // id는 MySQL에서 자동으로 만들어주며, 기본적으로 들어있다.
        email: {
            type: DataTypes.STRING(30), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
            allowNull: false, // 필수
            unique: true, // 고유한 값. 중복X
        },
        nickname: {
            type: DataTypes.STRING(30),
            allowNull: false, // 필수
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false, // 필수
        },
    }, {
        // 세팅 : 한글 저장
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    User.associate = (db) => {};
    return User;
}