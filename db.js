var mysql = require('mysql');    //수업용 MYSQL
var config = {
    connectionLimit:100,
    host:'hd9536.cafe24.com',
    user:'hd9536',  //cafe24아이디
    password:'inha1004!', 
    database:'hd9536',  //cafe24아이디
    typeCast: function (field, next) {
        if (field.type == 'VAR_STRING') return field.string();
        return next();
    }
}

var pool = mysql.createPool(config); 
var connection;

exports.connect = function() {
    pool.getConnection(function(err, con) {
            if(err) {
                console.log('db접속 오류:', err)
            }else {
                console.log('db접속 완료');
                connection = con; 
            }
        }
    );
}

exports.get = function() {
    return connection;
};
