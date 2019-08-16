#!/bin/bash
##这一段可用于下载配置文件等操作
## java web根目录是 /javaweb/bip/
##
##
curl -o /javaweb/bip/WEB-INF/classes/system.properties  http://conf.bofide.cn/conf/bip/java/system.properties
curl -o /javaweb/bip/WEB-INF/classes/log4j.properties  http://conf.bofide.cn/conf/bip/java/log4j.properties
/usr/local/apache-tomcat-8.5.28/bin/catalina.sh run