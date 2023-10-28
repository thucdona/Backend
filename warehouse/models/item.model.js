const database = require('../../src/models/dbconnection')
const Logs = require('../../src/middlewares/logs/server.log');
const Create = require('../../src/middlewares/create');

const createProduct = async (pt_name, pt_namesub, pt_part, pt_serial, pt_detail, cat_uuid,pt_note, pt_image, man_uuid ) => {
    try {
        return new Promise((resolve, reject) => {

            const pt_uuid = Create.uuid(); // tạo uuid

            const sql = "INSERT INTO `wh_items`(`pt_uuid`, `pt_name`, `pt_namesub`, `pt_part`,`pt_serial`, `pt_detail`, `cat_uuid`,`pt_note`, `pt_image`, `man_uuid`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            database.ConnectDatabase.query(sql, [pt_uuid, pt_name, pt_namesub, pt_part,pt_serial, pt_detail, cat_uuid, pt_note, pt_image, man_uuid], (error, elements) => {

                if (error) {
                    //viết log khi lỗi 
                    Logs.writeErrLog("04mait", JSON.stringify(error))
                    return reject({ 'error': true, data: error });
                }

                return resolve({ 'error': false, data: elements });

            });

        });

    } catch (error) {
        //viết log khi lỗi
        Logs.writeErrLog("SQLDB", "Lỗi hàm createProduct - mô tả:" + error)
        return false;
    }

}

///lấy thông tin

const getProduct = async (key, value, all) => {
    try {
        if(!all){all = false}
        var sql =""
        if (all === true) {
            sql = "SELECT * FROM `wh_items`";
        }
        else {
            sql = "SELECT * FROM `wh_items` WHERE ?? = ?";
        }
        const params = [key, value];
        
        return new Promise((resolve, reject) => {
            database.ConnectDatabase.query(sql, params, (error, elements) => {
                if (error) {
                    // Viết log khi lỗi
                    Logs.writeErrLog("SQLDB", "Lỗi hàm khi lấy dữ liệu getProduct - mô tả:" + error);
                    return reject({ 'error': true, data: error });
                }
                if (all === true) {
                    return resolve({ 'error': false, data: elements });
                } else {
                    return resolve({ 'error': false, data: elements[0] });
                }
                
            });
        });
    } catch (error) {
        // Viết log khi lỗi
        Logs.writeErrLog("SQLDB", "Lỗi hàm getProduct - mô tả:" + error);
        return false;
    }
}

const getItemList = async () => {
    try {
        const sql = "SELECT * FROM `wh_items`;";
        
        return new Promise((resolve, reject) => {
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
                    // Viết log khi lỗi
                    Logs.writeErrLog("SQLDB", "Lỗi hàm getItemList khi lấy dữ liệu - mô tả:" + error);
                    return reject({ 'error': true, data: error });
                }
                return resolve({ 'error': false, data: elements });
            });
        });
    } catch (error) {
        // Viết log khi lỗi
        Logs.writeErrLog("SQLDB", "Lỗi hàm getItemList - mô tả:" + error);
        return false;
    }
}

const getItemListCon = async (key, value) => {
    try {
        const sql = "SELECT * FROM `wh_items` WHERE ?? = ?";
        const params = [key, value];
        
        return new Promise((resolve, reject) => {
            database.ConnectDatabase.query(sql, params, (error, elements) => {
                if (error) {
                    // Viết log khi lỗi
                    Logs.writeErrLog("SQLDB", "Lỗi hàm getItemListCon khi lấy dữ liệu - mô tả:" + error);
                    return reject({ 'error': true, data: error });
                }
                return resolve({ 'error': false, data: elements });
            });
        });
    } catch (error) {
        // Viết log khi lỗi
        Logs.writeErrLog("SQLDB", "Lỗi hàm getItemListCon - mô tả:" + error);
        return false;
    }
}

const editProduct = async (key, value, uuid) => {
    try {
        const sql = "UPDATE `wh_items` SET ?? = ? WHERE `wh_items`.`pt_uuid` = ?";
        const params = [key, value, uuid];
        
        return new Promise((resolve, reject) => {
            database.ConnectDatabase.query(sql, params, (error, elements) => {
                if (error) {
                    // Viết log khi lỗi
                    Logs.writeErrLog("SQLDB", "Lỗi hàm khi sửa dữ liệu editProduct - mô tả:" + error);
                    return reject({ 'error': true, data: error });
                }
                return resolve({ 'error': false, data: elements });
            });
        });
    } catch (error) {
        // Viết log khi lỗi
        Logs.writeErrLog("SQLDB", "Lỗi hàm eiditItem - mô tả:" + error);
        return false;
    }
}

const deleteItem = async (uuid) => {
    try {
        const sql = "DELETE FROM `wh_items` WHERE `wh_items`.`item_uuid` = ?";
        const params = [uuid];
        
        return new Promise((resolve, reject) => {
            database.ConnectDatabase.query(sql, params, (error, elements) => {
                if (error) {
                    // Viết log khi lỗi
                    Logs.writeErrLog("02mdwa", JSON.stringify(error));
                    return reject({ 'error': true, data: error });
                }
                return resolve({ 'error': false, data: elements });
            });
        });
    } catch (error) {
        // Viết log khi lỗi
        Logs.writeErrLog("02mdwa", JSON.stringify(error));
        return false;
    }
}

const getItemData = async (key, value) => {
    try {
        const sql = "SELECT * FROM `wh_itemdata` WHERE ?? = ?";
        const params = [key, value];
        
        return new Promise((resolve, reject) => {
            database.ConnectDatabase.query(sql, params, (error, elements) => {
                if (error) {
                    // Viết log khi lỗi
                    Logs.writeErrLog("SQLDB", "Lỗi hàm khi lấy dữ liệu getItemData - mô tả:" + error);
                    return reject({ 'error': true, data: error });
                }
                return resolve({ 'error': false, data: elements[0] });
            });
        });
    } catch (error) {
        // Viết log khi lỗi
        Logs.writeErrLog("SQLDB", "Lỗi hàm getItemData - mô tả:" + error);
        return false;
    }
}

module.exports = {
    createProduct,
    getProduct,
    getItemList,
    editProduct,
    getItemListCon,
    deleteItem,
    getItemData
}