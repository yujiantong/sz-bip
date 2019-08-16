####sz_bip_node
### docker build -f sz_bip_node.dockerfile -t sz_bip_node:xx_version .

FROM bf_node:7
MAINTAINER feng811130@163.com
ENV CONF_SERVER http://conf.bofide.cn/conf/bip/node/common/
ENV CONF_FILES "configure.js"
ENV MODE "PRODUCT"
RUN yum install -y git
RUN mkdir /nodeweb
COPY    ./bip-node/  /nodeweb
WORKDIR /nodeweb
##修改静态目录为 发布模式，即js为压缩后
EXPOSE 3000
CMD ["/bin/bash" ,"bipnodeStarter.sh"]