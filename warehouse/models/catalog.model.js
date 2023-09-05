const database = require('../../src/models/dbconnection')
const Logs =  require('../../src/middlewares/logs/server.log');

const createCatalog = async (catalogData) => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO `wh_ct`(`ct_name`,`ct_info`, `ct_key`) VALUES ('" + catalogData.ct_name + "','" + catalogData.ct_info + "','" + catalogData.ct_key + "')";
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

const getCatalogbyKey = async (ct_key) => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM `wh_ct` WHERE `ct_key`='"+ct_key+"';";
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
                    //viết log khi lỗi
                    Logs.writeErrLog("SQLDB","Lỗi hàm khi lấy dữ liệu getCatalogbyKey - mô tả:" +error)
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
        Logs.writeErrLog("SQLDB","Lỗi hàm getCatalogbyKey - mô tả:" +error)
        return false;
    }
}

module.exports={
    createCatalog,
    getCatalogbyKey
}