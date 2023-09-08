const database = require('../dbconnection')
const Create = require('../../middlewares/create');
//lấy thông tin bảng Users
const getUsers = async () => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM `users`"
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    } catch {
        return false;
    }
}
//lấy thông tin một User nhất định với các thuộc tính cho trước
/**
 * This is an asynchronous function that retrieves user information from a database based on a
 * specified key-value pair.
 * @param key - The column name in the database table 'users' that you want to search for a specific
 * value.
 * @param value - The value parameter is a string that represents the value of the key being searched
 * for in the database query.
 * @returns A function named `getUserInfo` is being returned. This function takes two parameters `key`
 * and `value`. It uses a SQL query to select all columns from the `users` table where the value of the
 * specified `key` matches the specified `value`. The function returns a Promise that resolves to the
 * first element of the result set if the query is successful, or rejects with an error if
 */
const getUserInfo = async (key, value) => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM `users` WHERE `" + key + "`='" + value + "'"
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
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
    } catch {
        return false;
    }
}
//thêm mới user
const createUser = async (user_data) => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO `users`(`user_key`,`user_name`, `user_fullname`, `user_email`, `user_password`, `user_logs`) VALUES ('" + Create.uuid() + "','" + user_data.user_name + "','" + user_data.user_fullname + "','" + user_data.user_email + "','" + user_data.user_password + "','" + user_data.user_logs + "')";
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
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
        return false;
    }

}

/**
 * Hàm này để cập nhật dữ liệu vào User trên CSDL
 * @param key - Cột cần cập nhật
 * @param value - Giá trị cần cập nhật
 * @param wkey - Khoá vị trị cần cập nhật
 * @param wvalue - Giá trị của khoá vị trí
 * @returns A Promise is being returned that resolves to an object with an 'error' property and a
 * 'data' property. The 'error' property is a boolean indicating whether an error occurred during the
 * database query, and the 'data' property contains either the error object or the result of the query.
 */
const updateUser = async (key,value,wkey,wvalue) => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE `users` SET `"+key+"` = '"+value+"' WHERE `users`.`"+wkey+"` = '"+wvalue+"';";
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
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
        return false;
    }

}


const getRoleList = async () => {
    try {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM `roles`;";
            database.ConnectDatabase.query(sql, (error, elements) => {
                if (error) {
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
        return false;
    }
}
module.exports = {
    getUsers,
    getUserInfo,
    createUser,
    updateUser,
    getRoleList,
}