var web = {
    key : "bsp2014ForMobile",
    success:"OK",
    fault:"FAULT",

    bip :{
        host:'localhost',
        port:'8080',
        path: '/bip'
    }

}
var host = {
    bipHost : 'localhost'
}

exports.webConfigure  = web;
exports.hostConfig  = host;