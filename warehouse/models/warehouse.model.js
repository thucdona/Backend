const database = require('../../src/models/dbconnection')
const Logs =  require('../../src/middlewares/logs/server.log');
const Create = require('../../src/middlewares/create');

const createWarehouse = async (whs_name, whs_detail, whs_key) => {
    try {
        return new Promise((resolve, reject) => {
            const whs_uuid = Create.uuid()
            const sql = "INSERT INTO `wh_warehouses`(`whs_name`,`whs_detail`, `whs_key`, `whs_uuid`, `whs_enable`) VALUES ('" + whs_name + "','" + whs_detail + "','" + whs_key + "','" + whs_uuid + "','1');";
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
        Logs.writeErrLog("SQLDB","Lỗi hàm createWarehouse - mô tả:" +error)
        return false;
    }

}

///lấy thông tin

const getWarehouse = async (key, value) => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM `wh_warehouses` WHERE `"+key+"`='"+value+"';";
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
                    //viết log khi lỗi
                    Logs.writeErrLog("SQLDB","Lỗi hàm khi lấy dữ liệu getWarehouse - mô tả:" +error)
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
        Logs.writeErrLog("SQLDB","Lỗi hàm getWarehouse - mô tả:" +error)
        return false;
    }
}


//lấy full danh sách Whs
const getWhsList = async () => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM `wh_warehouses`;";
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
                    //viết log khi lỗi
                    Logs.writeErrLog("SQLDB","Lỗi hàm getWhsList khi lấy dữ liệu  - mô tả:" +error)
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
        Logs.writeErrLog("SQLDB","Lỗi hàm getWhsList - mô tả:" +error)
        return false;
    }
}

//lấy full danh sách kèm điều kiện value
const getWhsListCon = async (key,value) => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM `wh_warehouses` WHERE && `"+key+"` == '"+value+"';";
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
                    //viết log khi lỗi
                    Logs.writeErrLog("SQLDB","Lỗi hàm getWhsListCon khi lấy dữ liệu  - mô tả:" +error)
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
        Logs.writeErrLog("SQLDB","Lỗi hàm getWhsListCon - mô tả:" +error)
        return false;
    }
}

//sửa
const editWarehouse = async (key, value, uuid) => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE `wh_warehouses` SET `"+key+"` = '"+value+"' WHERE `wh_warehouses`.`whs_uuid` = '"+uuid+"';";
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
                    //viết log khi lỗi
                    Logs.writeErrLog("SQLDB","Lỗi hàm khi sửa dữ liệu editWarehouse - mô tả:" +error)
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
        Logs.writeErrLog("SQLDB","Lỗi hàm eiditWarehouse - mô tả:" +error)
        return false;
    }

}

//xoá 
const deleteWarehouse = async (uuid) => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM `wh_warehouses` WHERE `wh_warehouses`.`whs_uuid` = '"+uuid+"';";
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
                    //viết log khi lỗi
                    Logs.writeErrLog("02mdwa",JSON.stringify(error))
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
        Logs.writeErrLog("02mdwa",JSON.stringify(error))
        return false;
    }

}
module.exports={
    createWarehouse,
    getWarehouse,
    getWhsList,
    editWarehouse,
    getWhsListCon,
    deleteWarehouse
}