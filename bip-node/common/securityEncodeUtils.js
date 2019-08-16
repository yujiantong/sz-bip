var crypto = require('crypto');
var logger = require('./logger').logger;

var bofide_key = "BspAndBip";//密钥
var ssl_type = 'aes-128-ecb';//ssl

/**
 *
 * @param cleartext   明文（待加密内容）
 * @returns {*}  密文
 */
function  encryptEncode  (cleartext){
    try {
        var cipher = crypto.createCipher(ssl_type, bofide_key);
        var ciphertext = cipher.update(cleartext, 'utf8', 'hex');
        ciphertext += cipher.final('hex');
        return ciphertext;
    } catch (e) {
        logger.error(e);
        logger.error("加密失败");
        return 'Encryption failed';
    }
}

/**
 *
 * @param ciphertext 密文（待解密内容）
 * @returns {*} 明文
 */
function  decryptEncode  (ciphertext){
    try{
        const decipher = crypto.createDecipher(ssl_type, bofide_key);
        var cleartext = decipher.update(ciphertext, 'hex', 'utf8');
        cleartext += decipher.final('utf8');
        return cleartext;
    }catch(e){
        logger.error(e);
        logger.error("解密失败");
        return 'Decryption failed';
    }
}

function test (){
    var params = {
        time : (new Date()).getTime().toString(),//用于安全验证，接收端设置有效时长并判断合法性
        bsp_storeId : 100,
        bsp_userId : 199
    }
    var javaCiphertext = '6CB05B5959408A33296CD4C81FFA8AD86495F576BBEB2EFA0F6B' +
        'A31516AC22ED4A62ADBB630E1D69DC6D29D970FF46FFC7E15C45A361746A2FD80AEBCFEC6A3E';
    var ciphertext = encryptEncode(JSON.stringify(params));
    console.log('密文：' + ciphertext);
    var cleartext = decryptEncode(ciphertext);
    console.log('明文：'+cleartext);
    var cleartext2 = decryptEncode(javaCiphertext);
    console.log('明文：'+cleartext2);
}
//test();

exports.encryptEncode = encryptEncode;
exports.decryptEncode = decryptEncode;


