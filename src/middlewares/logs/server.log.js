//hàm chuyên

const fs = require('fs/promises');

const writeLogs =  async (logCode, logInfo) => {
  try {
    const date = Date();
    const content = date +':'+logCode+'-'+logInfo+"\r\n";
    await fs.appendFile('src/middlewares/logs/server-logs.log', content);
  } catch (err) {
    console.log(err);
  }
}
//Hàm này dành cho các lỗi
const writeErrLog =  async (Code, Content) => {
  try {
    const date = Date();
    const content = date +'>>>'+Code+'<<<'+Content+"\r\n";
    await fs.appendFile('src/middlewares/logs/err.log', content);
  } catch (err) {
    //cái phần viết log này mà lỗi thì in ra màn hình
    console.log(err);
  }
}

module.exports ={
    writeLogs,
    writeErrLog
}
