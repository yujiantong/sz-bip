#!/bin/bash
## 构建的命令就写在这里面
cd /nodeweb
npm install
bower install   --allow-root
gulp build