#docker build -f java-build.dockerfile  -t sz-java-build:1 .
FROM bf_java:8 
MAINTAINER feng811130@163.com
RUN mkdir /javaweb
WORKDIR /javaweb
VOLUME [ "/javaweb" ]
CMD [ "/bin/bash","bip/build.sh" ]
