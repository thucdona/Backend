 //Chương trình kiểm tra có phải Json hay không
 const  isValidJSON = (jsonString) =>{
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      return false;
    }
  }

module.exports = {
    isValidJSON
}