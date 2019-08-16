##docker build -f node-build-env.dockerfile  -t node-build-env:1 .
FROM bf_node:7
MAINTAINER feng811130@163.com
ENV CONF_SERVER http://conf.bofide.cn/conf/bip/node/common/
ENV CONF_FILES "configure.js"
ENV MODE "PRODUCT"
RUN yum install -y git
RUN mkdir /nodeweb
RUN npm install -g bower
RUN npm install -g  gulp
VOLUME [ "/nodeweb" ]
WORKDIR /nodeweb
CMD ["/bin/bash" , "sz-node-build.sh" ]