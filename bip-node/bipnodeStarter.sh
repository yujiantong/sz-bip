#!/bin/bash
##下载配置文件到指字目录等操作
curl -o common/configure.js  http://conf.bofide.cn/conf/bip/node/common/configure.js
##
##[ $MODE != "DEV" ] && sed -i "s|app.use(express.static(path.join(__dirname, 'public')))|app.use(express.static(path.join(__dirname, 'dist')))|g" /nodeweb/app.js
## 最近就是启动node的命令。。。
node bin/www