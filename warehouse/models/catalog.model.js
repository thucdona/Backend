const database = require('../../src/models/dbconnection')
const Logs =  require('../../src/middlewares/logs/server.log');
const Create = require('../../src/middlewares/create');

const createCatalog = async (cat_name, cat_detail, cat_key) => {
    try {
        return new Promise((resolve, reject) => {
            const cat_uuid = Create.uuid()
            const sql = "INSERT INTO `wh_catalogs`(`cat_name`,`cat_detail`, `cat_key`, `cat_uuid`, `cat_enable`) VALUES ('" + cat_name + "','" + cat_detail + "','" + cat_key + "','" + cat_uuid + "','1');";
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
                    //viết log khi lỗi
                    Logs.writeErrLog("01maca",JSON.stringify(error))
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


//lấy full danh sách Cat
const getCatList = async () => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM `wh_catalogs`;";
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
                    //viết log khi lỗi
                    Logs.writeErrLog("SQLDB","Lỗi hàm getCatList khi lấy dữ liệu  - mô tả:" +error)
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
        Logs.writeErrLog("SQLDB","Lỗi hàm getCatList - mô tả:" +error)
        return false;
    }
}

//lấy full danh sách kèm điều kiện value
const getCatListCon = async (key,value) => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM `wh_catalogs` WHERE && `"+key+"` == '"+value+"';";
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
                    //viết log khi lỗi
                    Logs.writeErrLog("SQLDB","Lỗi hàm getCatListCon khi lấy dữ liệu  - mô tả:" +error)
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
        Logs.writeErrLog("SQLDB","Lỗi hàm getCatListCon - mô tả:" +error)
        return false;
    }
}

//sửa
const editCatalog = async (key, value, uuid) => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE `wh_catalogs` SET `"+key+"` = '"+value+"' WHERE `wh_catalogs`.`cat_uuid` = '"+uuid+"';";
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
                    //viết log khi lỗi
                    Logs.writeErrLog("SQLDB","Lỗi hàm khi sửa dữ liệu editCatalog - mô tả:" +error)
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
        Logs.writeErrLog("SQLDB","Lỗi hàm eiditCatalog - mô tả:" +error)
        return false;
    }

}

//xoá 
const deleteCatalog = async (uuid) => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM `wh_catalogs` WHERE `wh_catalogs`.`cat_uuid` = '"+uuid+"';";
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
                    //viết log khi lỗi
                    Logs.writeErrLog("01mdca",JSON.stringify(error))
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
        Logs.writeErrLog("01mdca",JSON.stringify(error))
        return false;
    }

}
module.exports={
    createCatalog,
    getCatalog,
    getCatList,
    editCatalog,
    getCatListCon,
    deleteCatalog
}