const database = require('../../src/models/dbconnection')
const Logs =  require('../../src/middlewares/logs/server.log');

const createCatalog = async (cat_name, cat_detail, cat_key) => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO `wh_catalogs`(`cat_name`,`cat_detail`, `cat_key`) VALUES ('" + cat_name + "','" + cat_detail + "','" + cat_key + "')";
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
                    //viết log khi lỗi
                    Logs.writeErrLog("SQLDB","Lỗi hàm khi lấy dữ liệu createCatalog - mô tả:" +error)
                    return reject({
                        'error':true,
                        data: error
                    });
                }
                return resolve({
                    'error': false,
                    data: elements
                });
            });
        });
    } catch (error) {
        //viết log khi lỗi
        Logs.writeErrLog("SQLDB","Lỗi hàm createCatalog - mô tả:" +error)
        return false;
    }

}

///lấy thông tin

const getCatalog = async (key, value) => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM `wh_catalogs` WHERE `"+key+"`='"+value+"';";
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
                    //viết log khi lỗi
                    Logs.writeErrLog("SQLDB","Lỗi hàm khi lấy dữ liệu getCatalog - mô tả:" +error)
                    return reject({
                        'error':true,
                        data: error
                    });
                }
                return resolve({
                    'error': false,
                    data: elements[0]
                });
            });
        });
    } catch (error) {
        //viết log khi lỗi
        Logs.writeErrLog("SQLDB","Lỗi hàm getCatalog - mô tả:" +error)
        return false;
    }
}

module.exports={
    createCatalog,
    getCatalog,
}