var mysql = require('mysql');    //수업용 MYSQL
var config = {
    connectionLimit: 100,
    host: 'hd9536.cafe24.com',
    user: 'hd9536',  //cafe24아이디
    password: 'inha1004!',
    database: 'hd9536',  //cafe24아이디
    multipleStatements: true,
    typeCast: function (field, next) {
        if (field.type == 'VAR_STRING') return field.string();
        if (field.type === "BLOB" || field.type === "TEXT") {
            return field.buffer().toString('utf8');
        }
        return next();
    }
}

var pool = mysql.createPool(config);
var connection;

exports.connect = function () {
    pool.getConnection(function (err, con) {
        if (err) {
            console.log('db접속 오류:', err)
        } else {
            console.log('db접속 완료');
            connection = con;
        }
    }
    );
}

exports.get = function () {
    return connection;
};
