#!/bin/bash
git pull
today=`date +%Y-%m-%d`
 
#node 
#1 可选，先构建编译环境 
docker build -f node-build-env.dockerfile  -t node-build-env:1 .
#2 编译，压缩
docker run --rm -v /home/web/sz-bip/bip-node/:/nodeweb node-build-env:1
#3 打包发布镜向
docker build -f  sz_bip_node.dockerfile -t sz-bip-node:$today .
  
 
#java
#1 可选，先构建编译环境 
docker build -f java-build.dockerfile  -t sz-java-build:1 .
#2 运行镜像环境编译
docker run --rm -it  -v  /home/web/sz-bip/:/javaweb  -v /home/web/sz-bip/repo:/repo  sz-java-build:1 
#3 构建发布镜像
  docker build -f  sz_bip_java_web.dockerfile -t sz-bip-java:$today .
#push  可选


##run

[ -e /home/web/sz-bip/logs ] ||  mkdir /home/web/sz-bip/logs
docker rm -f bip-node-web
docker rm -f bip-java-web


docker run -d --restart=always --name=bip-node-web \
-v /etc/timezone:/etc/timezone \
-p 3000:3000 sz-bip-node:$today

docker run -d --restart=always --name=bip-java-web \
-v /etc/timezone:/etc/timezone \
-v /home/web/sz-bip/logs:/logs/ \
-p 8080:8080 sz-bip-java:$today

today=`date +%Y-%m-%d`

#标记，推送，清理
javaRegistry=registry.bofide.cn/bip/
nodeRegistry=registry.bofide.cn/bip/

docker images |grep sz-bip-node |grep $today
if [ $? == 0 ]; then
    docker tag sz-bip-node:$today ${nodeRegistry}sz-bip-node:$today
    docker push ${nodeRegistry}sz-bip-node:$today
    docker rmi ${nodeRegistry}sz-bip-node:$today
else
    echo "sz-bip-node   今天无镜向可推送，请先构建"
fi
docker images |grep sz-bip-java  |grep $today

if [ $? == 0 ]; then
    docker tag sz-bip-java:$today ${javaRegistry}sz-bip-java:$today 
    docker push ${javaRegistry}sz-bip-java:$today 
    docker rmi ${javaRegistry}sz-bip-java:$today 
else
    echo "sz-java-web   今天无镜向可推送，请先构建"
fi


 
 
# tag 为none的
 docker rmi $(docker images | awk '/^<none>/ { print $3 }')
#清理7天前的
day7ago=`date -d "-7 days" +%s`
IFS=$'\n\n';
for img in `docker images | grep "sz-bip-*"`;  do
     tag=`echo $img | awk '{ print $1}'` ;
     dockerId=`echo $img | awk '{ print $3}'` ;
     ceateDate=`date -d "$tag" +%s`
     if [ $day7ago -gt $ceateDate  ] ;then
        docker rmi $dockerId
     fi
 done ;


/home/bip/logs/:/logs/
/etc/timezone:/etc/timezone



