###sz_bip_java_web
FROM bf_java:8 
MAINTAINER feng811130@163.com
ENV LANG C.UTF-8
ENV JAVA_OPTS "-Dfile.encoding=UTF8 -Dsun.jnu.encoding=UTF8"
RUN mkdir /javaweb
COPY ./bip/target/bip /javaweb/bip
COPY ./bip/bipJavaStarter.sh /javaweb/
WORKDIR /javaweb
COPY ./bip/server.xml /usr/local/apache-tomcat-8.5.28/conf/
EXPOSE 8080

CMD ["/bin/bash", "bipJavaStarter.sh"]
