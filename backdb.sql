
CREATE DATABASE /*!32312 IF NOT EXISTS*/`bip` /*!40100 DEFAULT CHARACTER SET utf8 */;

use bip;

DROP TABLE IF EXISTS `bf_bip_approval_bill`;

CREATE TABLE `bf_bip_approval_bill` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '审批单自增id',
  `fourSStoreId` int(11) NOT NULL COMMENT '4s店id',
  `chassisNumber` varchar(50) DEFAULT NULL COMMENT '车架号',
  `jqxrqStart` date DEFAULT NULL COMMENT '保险到期日',
  `jqxrqEnd` date DEFAULT NULL COMMENT '保险到期日',
  `insurDate` date DEFAULT NULL COMMENT '投保日期',
  `renewalType` int(3) DEFAULT NULL COMMENT '投保类型',
  `renewalWay` varchar(20) DEFAULT NULL COMMENT '投保渠道',
  `solicitMember` varchar(20) DEFAULT NULL COMMENT '招揽员',
  `insured` varchar(20) DEFAULT NULL COMMENT '被保险人',
  `bbxrzjh` varchar(30) DEFAULT NULL COMMENT '被保险人证件号',
  `contact` varchar(20) DEFAULT NULL COMMENT '联系人',
  `contactWay` varchar(20) DEFAULT NULL COMMENT '联系方式',
  `insurancTypes` varchar(20) DEFAULT NULL COMMENT '商业险种',
  `kpxx` varchar(200) DEFAULT NULL COMMENT '开票信息',
  `syxje` float(11,2) DEFAULT '0.00' COMMENT '商业险金额',
  `jqxje` float(11,2) DEFAULT '0.00' COMMENT '交强险金额',
  `ccs` float(11,2) DEFAULT '0.00' COMMENT '车船税',
  `bfhj` float(11,2) DEFAULT '0.00' COMMENT '保费合计',
  `kpje` float(11,2) DEFAULT '0.00' COMMENT '开票金额',
  `yhje` float(11,2) DEFAULT '0.00' COMMENT '优惠金额',
  `ssje` float(11,2) DEFAULT '0.00' COMMENT '实收金额',
  `fkfs` varchar(30) DEFAULT NULL COMMENT '付款方式',
  `insuranceCompName` varchar(30) DEFAULT NULL COMMENT '保险公司',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_carBrand` */

DROP TABLE IF EXISTS `bf_bip_carBrand`;

CREATE TABLE `bf_bip_carBrand` (
  `brandId` int(7) NOT NULL AUTO_INCREMENT COMMENT '品牌id',
  `brandName` varchar(20) NOT NULL COMMENT '品牌名称',
  `createDate` date NOT NULL COMMENT '创建时间',
  `remark` varchar(20) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`brandId`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_carModel` */

DROP TABLE IF EXISTS `bf_bip_carModel`;

CREATE TABLE `bf_bip_carModel` (
  `modelId` int(7) NOT NULL AUTO_INCREMENT COMMENT '型号id',
  `modelName` varchar(20) NOT NULL COMMENT '型号名称',
  `brandId` int(7) NOT NULL COMMENT '品牌id',
  `createDate` date NOT NULL COMMENT '创建时间',
  `remark` varchar(20) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`modelId`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_cover_type` */

DROP TABLE IF EXISTS `bf_bip_cover_type`;

CREATE TABLE `bf_bip_cover_type` (
  `coverType` int(11) NOT NULL COMMENT '承保类型id',
  `coverTypeName` varchar(20) NOT NULL COMMENT '承保类型名称',
  PRIMARY KEY (`coverType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_customer` */

DROP TABLE IF EXISTS `bf_bip_customer`;

CREATE TABLE `bf_bip_customer` (
  `customerId` int(11) NOT NULL AUTO_INCREMENT COMMENT '潜在客户id',
  `fourSStoreId` int(11) DEFAULT NULL COMMENT '4s店id',
  `fourSStore` varchar(50) DEFAULT NULL COMMENT '4s店',
  `carLicenseNumber` varchar(30) DEFAULT NULL COMMENT '车牌号',
  `chassisNumber` varchar(50) DEFAULT NULL COMMENT '车架号',
  `engineNumber` varchar(50) DEFAULT NULL COMMENT '发动机号',
  `registrationDate` date DEFAULT NULL COMMENT '上牌日期',
  `carBrand` varchar(20) DEFAULT NULL COMMENT '汽车品牌',
  `vehicleModel` varchar(30) DEFAULT NULL COMMENT '车辆型号',
  `syxrqEnd` date DEFAULT NULL COMMENT '商业险到期日',
  `insuranceEndDate` date NOT NULL COMMENT '交强险到期日',
  `renewalType` int(3) NOT NULL COMMENT '投保类型',
  `renewalWay` varchar(20) DEFAULT NULL COMMENT '续保渠道',
  `insurDateLY` date DEFAULT NULL COMMENT '去年投保日期',
  `insuranceCompLY` varchar(30) DEFAULT NULL COMMENT '去年保险公司',
  `privilegeProLY` varchar(30) DEFAULT NULL COMMENT '去年优惠项目',
  `insuranceTypeLY` varchar(200) DEFAULT NULL COMMENT '去年投保险种',
  `remark` varchar(200) DEFAULT NULL COMMENT '备注',
  `carOwner` varchar(40) DEFAULT NULL COMMENT '车主',
  `insured` varchar(40) DEFAULT NULL COMMENT '被保险人',
  `certificateNumber` varchar(30) DEFAULT NULL COMMENT '被保险人证件号',
  `customerLevel` varchar(10) DEFAULT 'A' COMMENT '客户级别',
  `contact` varchar(20) NOT NULL COMMENT '联系人',
  `contactWay` varchar(20) NOT NULL COMMENT '联系方式',
  `address` varchar(100) DEFAULT NULL COMMENT '现地址',
  `isMaintainAgain` int(1) DEFAULT NULL COMMENT '是否本店再维修客户 0:表示“否”；1表示“是”',
  `maintainNumberLY` int(3) DEFAULT NULL COMMENT '去年本店维修次数',
  `accidentNumberLY` int(3) DEFAULT NULL COMMENT '去年出险次数',
  `accidentOutputValueLY` int(11) DEFAULT NULL COMMENT '去年本店事故生产值',
  `serviceConsultantId` varchar(20) DEFAULT NULL COMMENT '服务顾问',
  `serviceConsultant` varchar(20) DEFAULT NULL COMMENT '服务顾问',
  `customerSource` varchar(20) DEFAULT NULL COMMENT '客户来源',
  `customerCharacter` varchar(20) DEFAULT NULL COMMENT '客户性质',
  `sfgyx` int(1) DEFAULT NULL COMMENT '是否高意向 0:表示“否”；1表示“是”',
  `customerDescription` varchar(100) DEFAULT NULL COMMENT '客户描述',
  `insuranceNumber` varchar(30) DEFAULT NULL COMMENT '保单号',
  `solicitMemberLY` varchar(20) DEFAULT NULL COMMENT '去年招揽员',
  `insurNumber` int(3) DEFAULT NULL COMMENT '本店投保次数',
  `insuranceCoverageLY` float(11,2) DEFAULT '0.00' COMMENT '去年投保保额',
  `principalId` int(3) DEFAULT NULL COMMENT '当前负责人id',
  `principal` varchar(30) DEFAULT NULL COMMENT '当前负责人',
  `virtualJqxdqr` date NOT NULL COMMENT '虚拟的交强险到期日',
  `status` int(3) DEFAULT '1' COMMENT '是否分配状态,1表示未分配,2表示已分配',
  `clerk` varchar(30) DEFAULT NULL COMMENT '业务员',
  `clerkId` int(7) DEFAULT NULL COMMENT '业务员id',
  `lastYearIsDeal` int(3) DEFAULT '0' COMMENT '上一年是否成交保单，1代表是，0代表否',
  `cusLostInsurStatu` int(3) DEFAULT NULL COMMENT '潜客脱保状态',
  PRIMARY KEY (`customerId`),
  UNIQUE KEY `id_index` (`customerId`) USING BTREE,
  UNIQUE KEY `chassisNum_index` (`chassisNumber`,`fourSStoreId`) USING BTREE,
  KEY `jqxdqr_index` (`virtualJqxdqr`) USING BTREE,
  KEY `contact_index` (`contact`) USING BTREE,
  KEY `status_index` (`status`) USING HASH,
  KEY `renewal_index` (`renewalType`) USING HASH,
  KEY `storeId_index` (`fourSStoreId`) USING HASH,
  KEY `carBrand_index` (`carBrand`) USING BTREE,
  KEY `insuranceComp_index` (`insuranceCompLY`) USING BTREE,
  KEY `carLicenseNumber_index` (`carLicenseNumber`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_customer_assign` */

DROP TABLE IF EXISTS `bf_bip_customer_assign`;

CREATE TABLE `bf_bip_customer_assign` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `customerId` int(11) NOT NULL COMMENT '潜在客户id',
  `userId` int(11) NOT NULL COMMENT '用户Id',
  `traceStatu` int(3) DEFAULT '0' COMMENT '跟踪状态',
  `traceDate` date DEFAULT NULL COMMENT '跟踪时间',
  `inviteStatu` int(3) DEFAULT NULL COMMENT '潜客邀约状态',
  `inviteDate` date DEFAULT NULL COMMENT '邀约日期',
  `acceptStatu` int(3) DEFAULT NULL COMMENT '接受状态',
  `acceptDate` date DEFAULT NULL COMMENT '接受时间',
  `returnStatu` int(3) DEFAULT NULL COMMENT '回退状态',
  `returnDate` date DEFAULT NULL COMMENT '回退时间',
  `customerTraceId` int(11) DEFAULT NULL COMMENT '跟踪记录id,出单员用来确认邀约，更改跟踪记录的进店字段',
  `assignDate` date NOT NULL COMMENT '分配日期',
  `delayDate` date DEFAULT NULL COMMENT '延期到期日',
  PRIMARY KEY (`id`),
  UNIQUE KEY `customerId_userId_index` (`customerId`,`userId`) USING BTREE,
  KEY `customer_index` (`customerId`) USING BTREE,
  KEY `userId_index` (`userId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_customer_trace_recode` */

DROP TABLE IF EXISTS `bf_bip_customer_trace_recode`;

CREATE TABLE `bf_bip_customer_trace_recode` (
  `customerTraceId` int(11) NOT NULL AUTO_INCREMENT COMMENT '跟踪记录id',
  `customerId` int(11) NOT NULL COMMENT '潜在客户id',
  `nextTraceDate` date DEFAULT NULL COMMENT '下次跟踪日期',
  `renewalType` varchar(10) DEFAULT NULL COMMENT '续保类型',
  `customerLevel` varchar(10) DEFAULT NULL COMMENT '客户级别',
  `inviteDate` date DEFAULT NULL COMMENT '邀约日期',
  `traceContext` varchar(200) NOT NULL COMMENT '跟踪内容',
  `currentTraceDate` datetime DEFAULT NULL COMMENT '当次跟踪日期',
  `customerDescription` varchar(200) DEFAULT NULL COMMENT '客户描述',
  `quote` int(1) DEFAULT NULL COMMENT '是否报价 0表示“是”，1表示“否”',
  `quotedPrice` float(11,2) DEFAULT '0.00' COMMENT '报价',
  `principalId` int(7) DEFAULT NULL COMMENT '当前负责人id',
  `principal` varchar(20) DEFAULT '' COMMENT '当前负责人',
  `invite` int(1) DEFAULT NULL COMMENT '是否邀约',
  `comeStore` int(1) DEFAULT NULL COMMENT '是否进店',
  `sfjt` int(1) DEFAULT NULL COMMENT '是否接通 0:表示否；1表示是',
  `outBillDay` int(5) DEFAULT NULL COMMENT '提前出单天数',
  `inviteNumber` int(5) DEFAULT NULL COMMENT '邀约次数',
  `lxr` varchar(20) DEFAULT NULL COMMENT '联系人',
  `lxfs` varchar(40) DEFAULT NULL COMMENT '联系方式',
  `cx` varchar(20) DEFAULT NULL COMMENT '车型',
  `bxdqr` date DEFAULT NULL COMMENT '保险到期日',
  `cyts` int(11) DEFAULT NULL COMMENT '持有天数',
  `currentNeedTraceDate` date DEFAULT NULL COMMENT '本次应跟踪日期',
  `syxbj` float(11,2) DEFAULT '0.00' COMMENT '商业险报价',
  `jqxbj` float(11,2) DEFAULT '0.00' COMMENT '交强险报价',
  `ccsbj` float(11,2) DEFAULT '0.00' COMMENT '车船税报价',
  `dealInsur` int(11) DEFAULT NULL COMMENT '是否出单标志',
  PRIMARY KEY (`customerTraceId`),
  UNIQUE KEY `traceId_index` (`customerTraceId`) USING BTREE,
  KEY `customerId_index` (`customerId`) USING BTREE,
  KEY `principalId_index` (`principalId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_factorage_setting` */

DROP TABLE IF EXISTS `bf_bip_factorage_setting`;

CREATE TABLE `bf_bip_factorage_setting` (
  `factorageId` int(7) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `storeId` int(11) NOT NULL COMMENT '4s店id',
  `compPreId` int(11) NOT NULL COMMENT '关联保险公司主id',
  `insuName` varchar(20) NOT NULL COMMENT '险种名称',
  `insuPercent` float(11,2) NOT NULL DEFAULT '0.00' COMMENT '手续费百分比',
  PRIMARY KEY (`factorageId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_giving_information` */

DROP TABLE IF EXISTS `bf_bip_giving_information`;

CREATE TABLE `bf_bip_giving_information` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '赠送信息自增id',
  `approvalBillId` int(11) NOT NULL COMMENT '审批单id',
  `zsxx` varchar(200) DEFAULT NULL COMMENT '赠送信息',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1289 DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_insurance_bill` */

DROP TABLE IF EXISTS `bf_bip_insurance_bill`;

CREATE TABLE `bf_bip_insurance_bill` (
  `insuranceBillId` int(11) NOT NULL AUTO_INCREMENT COMMENT '保单id',
  `fourSStoreId` int(11) DEFAULT NULL COMMENT '4s店id',
  `foursStore` varchar(50) DEFAULT NULL COMMENT '4s店',
  `carLicenseNumber` varchar(30) DEFAULT NULL COMMENT ' 车牌号',
  `chassisNumber` varchar(50) NOT NULL COMMENT '车架号',
  `engineNumber` varchar(50) DEFAULT NULL COMMENT '发动机号',
  `registrationDate` date DEFAULT NULL COMMENT '上牌日期',
  `carBrand` varchar(20) DEFAULT NULL COMMENT '汽车品牌',
  `vehicleModel` varchar(30) DEFAULT NULL COMMENT '车辆型号',
  `binsuranceNumber` varchar(50) DEFAULT NULL COMMENT '商业保险单号',
  `binsuranceCoverage` float(11,2) DEFAULT '0.00' COMMENT '商业险保额',
  `vehicleTax` float(11,2) DEFAULT '0.00' COMMENT '车船税金额',
  `privilegePro` varchar(30) DEFAULT NULL COMMENT '优惠项目',
  `renewalWay` varchar(20) DEFAULT NULL COMMENT '续保渠道',
  `insurNumber` int(3) DEFAULT NULL COMMENT '本店投保次数',
  `cinsuranceNumber` varchar(50) DEFAULT NULL COMMENT '交强险单号',
  `cinsuranceCoverage` float(11,2) NOT NULL DEFAULT '0.00' COMMENT '交强险保额',
  `premiumCount` float(11,2) DEFAULT '0.00' COMMENT '保费合计',
  `privilegeSum` float(11,2) DEFAULT '0.00' COMMENT '优惠金额',
  `donateCostCount` float(11,2) DEFAULT '0.00' COMMENT '赠送成本合计',
  `factorageCount` float(11,2) DEFAULT '0.00' COMMENT '手续费合计',
  `realPay` float(11,2) DEFAULT '0.00' COMMENT '实收金额',
  `payWay` varchar(20) DEFAULT NULL COMMENT '付款方式',
  `sdfs` varchar(30) DEFAULT NULL COMMENT '运单方式',
  `profit` float(11,2) DEFAULT '0.00' COMMENT '利润',
  `coverType` int(11) DEFAULT NULL COMMENT '承保类型',
  `insurDate` date DEFAULT NULL COMMENT '投保日期',
  `syxrqStart` date DEFAULT NULL COMMENT '商业险开始日期',
  `syxrqEnd` date DEFAULT NULL COMMENT '商业险结束日期',
  `jqxrqStart` date NOT NULL COMMENT '交强险开始日期',
  `jqxrqEnd` date NOT NULL COMMENT '交强险结束日期',
  `qnbe` float(11,2) DEFAULT '0.00' COMMENT '去年保额',
  `qnsyxje` float(11,2) DEFAULT '0.00' COMMENT '去年商业险金额',
  `qnjqxje` float(11,2) DEFAULT '0.00' COMMENT '去年交强险金额',
  `qnccsje` float(11,2) DEFAULT '0.00' COMMENT '去年车船税金额',
  `invoiceName` varchar(50) DEFAULT NULL COMMENT '开票名称',
  `insuranceCompName` varchar(30) DEFAULT NULL COMMENT '保险公司',
  `insuranceType` varchar(30) DEFAULT NULL COMMENT '商业险险种',
  `remark` varchar(200) DEFAULT NULL COMMENT '备注',
  `principalId` int(7) DEFAULT NULL COMMENT '当前负责人id',
  `principal` varchar(20) DEFAULT NULL COMMENT '当前负责人',
  `clerkId` int(7) DEFAULT NULL COMMENT '业务员或销售员id',
  `clerk` varchar(20) DEFAULT NULL COMMENT '业务员或销售员',
  `insuranceWriterId` int(7) DEFAULT NULL COMMENT '出单员id',
  `insuranceWriter` varchar(20) DEFAULT NULL COMMENT '出单员',
  `cashier` varchar(20) DEFAULT NULL COMMENT '收银员',
  `solicitMemberId` int(7) DEFAULT NULL COMMENT '招揽员id',
  `solicitMember` varchar(20) DEFAULT NULL COMMENT '招揽员',
  `carOwner` varchar(40) DEFAULT NULL COMMENT '车主',
  `insured` varchar(40) DEFAULT NULL COMMENT '被保险人',
  `certificateNumber` varchar(40) DEFAULT NULL COMMENT '被保险人证件号',
  `contact` varchar(20) NOT NULL COMMENT '联系人',
  `contactWay` varchar(20) NOT NULL COMMENT '联系方式',
  `customerSource` varchar(20) DEFAULT NULL COMMENT '客户来源',
  `customerCharacter` varchar(20) DEFAULT NULL COMMENT '客户性质',
  `address` varchar(100) DEFAULT NULL COMMENT '现地址',
  `cdrq` date DEFAULT NULL COMMENT '出单日期',
  PRIMARY KEY (`insuranceBillId`),
  KEY `chassisNum_index` (`chassisNumber`) USING BTREE,
  KEY `cdrq_index` (`cdrq`) USING BTREE,
  KEY `principalId_index` (`principalId`) USING BTREE,
  KEY `coverType_index` (`coverType`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_insurance_company` */

DROP TABLE IF EXISTS `bf_bip_insurance_company`;

CREATE TABLE `bf_bip_insurance_company` (
  `insuranceCompId` int(11) NOT NULL AUTO_INCREMENT COMMENT '保险公司id',
  `insuranceCompName` varchar(30) NOT NULL COMMENT '保险公司',
  `typeName` varchar(500) NOT NULL COMMENT '险种名称,多种,/分隔',
  `createDate` date NOT NULL COMMENT '创建时间',
  `remark` varchar(20) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`insuranceCompId`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_insurance_company_4s` */

DROP TABLE IF EXISTS `bf_bip_insurance_company_4s`;

CREATE TABLE `bf_bip_insurance_company_4s` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `insuranceCompId` int(11) NOT NULL COMMENT '保险公司id',
  `fourSId` int(11) NOT NULL COMMENT '4s店Id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=265 DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_insurance_trace` */

DROP TABLE IF EXISTS `bf_bip_insurance_trace`;

CREATE TABLE `bf_bip_insurance_trace` (
  `insuranceTraceId` int(11) NOT NULL AUTO_INCREMENT COMMENT '跟踪记录id',
  `insuranceBillId` int(11) NOT NULL COMMENT '保单id',
  `principal` varchar(20) NOT NULL COMMENT '负责人',
  `traceClcye` varchar(50) DEFAULT NULL COMMENT '跟踪周期',
  `traceNumber` int(3) DEFAULT NULL COMMENT '跟踪次数',
  `coverType` varchar(20) NOT NULL COMMENT '承保类型',
  `advanceOutDate` int(3) DEFAULT NULL COMMENT '提前出单天数(天)',
  `isInvite` int(1) DEFAULT NULL COMMENT '是否邀约 0:表示“是”；1表示“否”',
  `inviteNumber` int(2) DEFAULT NULL COMMENT '邀约次数',
  `isInviteToStore` int(1) DEFAULT NULL COMMENT '是否邀约进店 0:表示“是”；1表示“否”',
  `remark` varchar(200) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`insuranceTraceId`),
  UNIQUE KEY `insurTraceId_index` (`insuranceTraceId`) USING BTREE,
  KEY `insurBillId_index` (`insuranceBillId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_insurance_trace_recode` */

DROP TABLE IF EXISTS `bf_bip_insurance_trace_recode`;

CREATE TABLE `bf_bip_insurance_trace_recode` (
  `insurTraceRecodeId` int(11) NOT NULL AUTO_INCREMENT COMMENT '跟踪记录id',
  `insuranceId` int(11) NOT NULL COMMENT '保单id',
  `nextTraceDate` date DEFAULT NULL COMMENT '下次跟踪日期',
  `renewalType` varchar(10) DEFAULT NULL COMMENT '投保类型',
  `customerLevel` varchar(10) DEFAULT NULL COMMENT '客户级别',
  `traceContext` varchar(200) DEFAULT NULL COMMENT '跟踪内容',
  `currentTraceDate` date DEFAULT NULL COMMENT '当次跟踪日期',
  PRIMARY KEY (`insurTraceRecodeId`),
  KEY `insuranceId_index` (`insuranceId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_insurance_type` */

DROP TABLE IF EXISTS `bf_bip_insurance_type`;

CREATE TABLE `bf_bip_insurance_type` (
  `typeId` int(7) NOT NULL AUTO_INCREMENT COMMENT '险种id',
  `typeName` varchar(20) NOT NULL COMMENT '险种名称',
  `createDate` date NOT NULL COMMENT '创建时间',
  `remark` varchar(20) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`typeId`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_message` */

DROP TABLE IF EXISTS `bf_bip_message`;

CREATE TABLE `bf_bip_message` (
  `messageId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'messageId',
  `storeId` int(11) NOT NULL COMMENT '4s店id',
  `userId` int(11) NOT NULL COMMENT '用户id',
  `operatorId` int(11) NOT NULL COMMENT '操作人id',
  `operatorName` varchar(20) NOT NULL COMMENT '操作人名称',
  `content` varchar(200) NOT NULL COMMENT '内容',
  `messageDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '消息时间',
  `readStatus` int(2) DEFAULT '0' COMMENT '阅读状态 0-未阅读 1-已阅读',
  `remark` varchar(200) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`messageId`),
  KEY `userid_index` (`userId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_module_setting` */

DROP TABLE IF EXISTS `bf_bip_module_setting`;

CREATE TABLE `bf_bip_module_setting` (
  `moduleSetId` int(7) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `fourSStoreId` int(11) NOT NULL COMMENT '4s店id',
  `moduleName` varchar(20) NOT NULL COMMENT '模块名称',
  `switchOn` int(4) NOT NULL COMMENT '状态,0：开,1关',
  PRIMARY KEY (`moduleSetId`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_operation_record` */

DROP TABLE IF EXISTS `bf_bip_operation_record`;

CREATE TABLE `bf_bip_operation_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `userId` int(11) NOT NULL COMMENT '用户id',
  `customerId` int(11) NOT NULL COMMENT '潜客id',
  `coverType` int(11) DEFAULT '0' COMMENT '投保类型',
  `operationFlag` int(11) NOT NULL COMMENT '操作标志:1.延期成功标志;2.回退成功标志;3.激活成功标志;4.转入标志;5.转出标志;6.分配标志;7.将脱保标志;8.已脱保标志;9.跟踪标志',
  `operationDate` date NOT NULL COMMENT '操作时间',
  PRIMARY KEY (`id`),
  KEY `userId_index` (`userId`) USING BTREE,
  KEY `operationDate_index` (`operationDate`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_renewaling_customer` */

DROP TABLE IF EXISTS `bf_bip_renewaling_customer`;

CREATE TABLE `bf_bip_renewaling_customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `customerId` int(11) NOT NULL COMMENT '潜在客户id',
  `fourSStoreId` int(11) DEFAULT NULL COMMENT '4s店id',
  `fourSStore` varchar(50) DEFAULT NULL COMMENT '4s店',
  `carLicenseNumber` varchar(30) DEFAULT NULL COMMENT '车牌号',
  `chassisNumber` varchar(50) DEFAULT NULL COMMENT '车架号',
  `engineNumber` varchar(50) DEFAULT NULL COMMENT '发动机号',
  `registrationDate` date DEFAULT NULL COMMENT '上牌日期',
  `carBrand` varchar(20) DEFAULT NULL COMMENT '汽车品牌',
  `vehicleModel` varchar(30) DEFAULT NULL COMMENT '车辆型号',
  `syxrqEnd` date DEFAULT NULL COMMENT '商业险到期日',
  `insuranceEndDate` date NOT NULL COMMENT '交强险到期日',
  `renewalType` int(3) NOT NULL COMMENT '投保类型',
  `renewalWay` varchar(20) DEFAULT NULL COMMENT '续保渠道',
  `insurDateLY` date DEFAULT NULL COMMENT '去年投保日期',
  `insuranceCompLY` varchar(30) DEFAULT NULL COMMENT '去年保险公司',
  `privilegeProLY` varchar(30) DEFAULT NULL COMMENT '去年优惠项目',
  `insuranceTypeLY` varchar(200) DEFAULT NULL COMMENT '去年投保险种',
  `remark` varchar(200) DEFAULT NULL COMMENT '备注',
  `carOwner` varchar(40) DEFAULT NULL COMMENT '车主',
  `insured` varchar(40) DEFAULT NULL COMMENT '被保险人',
  `certificateNumber` varchar(30) DEFAULT NULL COMMENT '被保险人证件号',
  `customerLevel` varchar(10) DEFAULT 'A' COMMENT '客户级别',
  `contact` varchar(20) NOT NULL COMMENT '联系人',
  `contactWay` varchar(20) NOT NULL COMMENT '联系方式',
  `address` varchar(100) DEFAULT NULL COMMENT '现地址',
  `isMaintainAgain` int(1) DEFAULT NULL COMMENT '是否本店再维修客户 0:表示“否”；1表示“是”',
  `maintainNumberLY` int(3) DEFAULT NULL COMMENT '去年本店维修次数',
  `accidentNumberLY` int(3) DEFAULT NULL COMMENT '去年出险次数',
  `accidentOutputValueLY` int(11) DEFAULT NULL COMMENT '去年本店事故生产值',
  `serviceConsultantId` varchar(20) DEFAULT NULL COMMENT '服务顾问ID',
  `serviceConsultant` varchar(20) DEFAULT NULL COMMENT '服务顾问',
  `customerSource` varchar(20) DEFAULT NULL COMMENT '客户来源',
  `customerCharacter` varchar(20) DEFAULT NULL COMMENT '客户性质',
  `sfgyx` int(1) DEFAULT NULL COMMENT '是否高意向 0:表示“否”；1表示“是”',
  `customerDescription` varchar(100) DEFAULT NULL COMMENT '客户描述',
  `insuranceNumber` varchar(30) DEFAULT NULL COMMENT '保单号',
  `solicitMemberLY` varchar(20) DEFAULT NULL COMMENT '去年招揽员',
  `insurNumber` int(3) DEFAULT NULL COMMENT '本店投保次数',
  `insuranceCoverageLY` float(11,2) DEFAULT '0.00' COMMENT '去年投保保额',
  `principalId` int(3) DEFAULT NULL COMMENT '当前负责人id',
  `principal` varchar(30) DEFAULT NULL COMMENT '当前负责人',
  `virtualJqxdqr` date NOT NULL COMMENT '虚拟的交强险到期日',
  `isInvite` int(1) DEFAULT NULL COMMENT '是否邀约  0:表示“否”；1表示“是”',
  `isComeStore` int(1) DEFAULT NULL COMMENT '是否到店 0:表示“否”；1表示“是”',
  `comeStoreDate` date DEFAULT NULL COMMENT '到店日期',
  `isQuote` int(1) DEFAULT NULL COMMENT '是否报价 0:表示“否”；1表示“是”',
  `quoteDate` date DEFAULT NULL COMMENT '报价日期',
  `comeStoreNumber` int(3) DEFAULT NULL COMMENT '到店次数',
  `lastTraceDate` date DEFAULT NULL COMMENT '末次跟踪日期',
  `willingTraceDate` date DEFAULT NULL COMMENT '应跟踪日期',
  `lastTraceResult` varchar(200) DEFAULT NULL COMMENT '末次跟踪结果',
  `clerk` varchar(30) DEFAULT NULL COMMENT '业务员',
  `clerkId` int(7) DEFAULT NULL COMMENT '业务员id',
  `firstAcceptDate` date DEFAULT NULL COMMENT '初始接收时间',
  `lastYearIsDeal` int(3) DEFAULT '0' COMMENT '上一年是否成交保单，1代表是，0代表否',
  `cusLostInsurStatu` int(3) DEFAULT NULL COMMENT '潜客脱保状态',
  `inviteDate` date DEFAULT NULL COMMENT '邀约日期',
  `status` int(2) DEFAULT '0' COMMENT '潜客状态',
  PRIMARY KEY (`id`),
  UNIQUE KEY `chassisNum_index` (`chassisNumber`,`fourSStoreId`) USING BTREE,
  KEY `customerId_index` (`customerId`) USING BTREE,
  KEY `contact_index` (`contact`) USING BTREE,
  KEY `Jqxdqr_index` (`virtualJqxdqr`) USING BTREE,
  KEY `renewal_index` (`renewalType`) USING HASH,
  KEY `storeId_index` (`fourSStoreId`) USING HASH,
  KEY `carBrand_index` (`carBrand`) USING BTREE,
  KEY `insuranceComp_index` (`insuranceCompLY`) USING BTREE,
  KEY `carLicenseNumber_index` (`carLicenseNumber`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=169 DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_role` */

DROP TABLE IF EXISTS `bf_bip_role`;

CREATE TABLE `bf_bip_role` (
  `roleId` int(11) NOT NULL COMMENT '角色Id',
  `roleName` varchar(20) NOT NULL COMMENT '用户名',
  PRIMARY KEY (`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_store` */

DROP TABLE IF EXISTS `bf_bip_store`;

CREATE TABLE `bf_bip_store` (
  `storeId` int(7) NOT NULL AUTO_INCREMENT COMMENT '4s店id',
  `storeName` varchar(20) NOT NULL COMMENT '4S店名称',
  `shortStoreName` varchar(20) NOT NULL COMMENT '4S店简称',
  `adminAccount` varchar(20) NOT NULL COMMENT 'AM账号',
  `adminPassword` varchar(128) NOT NULL COMMENT 'AM密码',
  `carBrand` varchar(500) NOT NULL COMMENT '汽车品牌',
  `createDate` date NOT NULL COMMENT '创建时间',
  `deleted` int(2) DEFAULT '0',
  `deleteDate` date DEFAULT NULL,
  `remark` varchar(20) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`storeId`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_traceday_setting` */

DROP TABLE IF EXISTS `bf_bip_traceday_setting`;

CREATE TABLE `bf_bip_traceday_setting` (
  `traceSetId` int(7) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `fourSStoreId` int(11) NOT NULL COMMENT '4s店id',
  `customerLevel` varchar(20) NOT NULL COMMENT '客户级别',
  `dayNumber` int(4) NOT NULL COMMENT '天数',
  PRIMARY KEY (`traceSetId`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;

/*Table structure for table `bf_bip_user` */

DROP TABLE IF EXISTS `bf_bip_user`;

CREATE TABLE `bf_bip_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `storeId` int(11) NOT NULL COMMENT '4s店id',
  `loginName` varchar(64) NOT NULL COMMENT '登录名',
  `userName` varchar(20) NOT NULL COMMENT '用户名',
  `phone` varchar(40) DEFAULT NULL COMMENT '电话',
  `email` varchar(40) DEFAULT NULL COMMENT '邮箱',
  `password` varchar(128) NOT NULL COMMENT '登录密码',
  `roleId` int(20) NOT NULL COMMENT '角色Id',
  `superiorId` int(11) DEFAULT NULL COMMENT '上级Id',
  `createDate` date NOT NULL COMMENT '创建时间',
  `deleteDate` date DEFAULT NULL COMMENT '删除时间',
  `deleted` int(2) DEFAULT '0' COMMENT '是否被删除',
  `status` int(2) DEFAULT '0',
  `remark` varchar(200) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_index` (`id`) USING BTREE,
  KEY `storeId_index` (`storeId`) USING HASH,
  KEY `roleId` (`roleId`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=utf8;


insert  into `bf_bip_cover_type`(`coverType`,`coverTypeName`) values (1,'新保');
insert  into `bf_bip_cover_type`(`coverType`,`coverTypeName`) values (2,'新转续');
insert  into `bf_bip_cover_type`(`coverType`,`coverTypeName`) values (3,'续转续');
insert  into `bf_bip_cover_type`(`coverType`,`coverTypeName`) values (4,'间转续');
insert  into `bf_bip_cover_type`(`coverType`,`coverTypeName`) values (5,'潜转续');
insert  into `bf_bip_cover_type`(`coverType`,`coverTypeName`) values (6,'首次');



insert  into `bf_bip_role`(`roleId`,`roleName`) values (1,'出单员');
insert  into `bf_bip_role`(`roleId`,`roleName`) values (2,'续保专员');
insert  into `bf_bip_role`(`roleId`,`roleName`) values (3,'续保主管');
insert  into `bf_bip_role`(`roleId`,`roleName`) values (4,'客服经理');
insert  into `bf_bip_role`(`roleId`,`roleName`) values (5,'客服专员');
insert  into `bf_bip_role`(`roleId`,`roleName`) values (6,'销售顾问');
insert  into `bf_bip_role`(`roleId`,`roleName`) values (7,'销售经理');
insert  into `bf_bip_role`(`roleId`,`roleName`) values (8,'服务顾问');
insert  into `bf_bip_role`(`roleId`,`roleName`) values (9,'服务经理');
insert  into `bf_bip_role`(`roleId`,`roleName`) values (10,'保险经理');
insert  into `bf_bip_role`(`roleId`,`roleName`) values (11,'总经理');
insert  into `bf_bip_role`(`roleId`,`roleName`) values (12,'集团');
insert  into `bf_bip_role`(`roleId`,`roleName`) values (13,'厂家');
insert  into `bf_bip_role`(`roleId`,`roleName`) values (14,'4s店管理员');
insert  into `bf_bip_role`(`roleId`,`roleName`) values (15,'超级管理员');

INSERT INTO `bf_bip_user` ( `id`, `storeId`, `loginName`, `userName`, `phone`, `email`, `password`, `roleId`, `superiorId`, `createDate`, `deleteDate`, `deleted`, `status`, `remark` ) VALUES ( 1, 1, 'BOFIDE_AM', '系统管理员', '1111111', '1111111', '056386D3989FAD1A093B86BDFF527D51', 15, 0, '2016-06-20', NULL, 0, 0, '博福管理员' );

/*修改保单表的商业险险种字段（insuranceType）的长度为512；2016-08-26*/
alter table bf_bip_insurance_bill modify column insuranceType varchar(512);
/*修改审批单表的商业险险种字段（insurancTypes）的长度为512；2016-08-26*/
alter table bf_bip_approval_bill modify column insurancTypes varchar(512);

/*修改bf_bip_customer的字段的长度;2016-08-28*/
ALTER table bf_bip_customer MODIFY column vehicleModel varchar(50) DEFAULT NULL COMMENT '车辆型号' ; 
ALTER table bf_bip_customer MODIFY column carOwner varchar(80) DEFAULT NULL COMMENT '车主';
ALTER table bf_bip_customer MODIFY column insured varchar(80) DEFAULT NULL COMMENT '被保险人';
ALTER table bf_bip_customer MODIFY column certificateNumber varchar(80) DEFAULT NULL COMMENT '被保险人证件号';
ALTER table bf_bip_customer MODIFY column contact varchar(80)  NOT NULL COMMENT '联系人';
ALTER table bf_bip_customer MODIFY column contactWay varchar(60)  NOT NULL COMMENT '联系方式';
ALTER table bf_bip_customer MODIFY column insuranceCompLY varchar(50)  DEFAULT NULL COMMENT '去年保险公司';


/*修改bf_bip_renewaling_customer的字段的长度;2016-08-28*/
ALTER table bf_bip_renewaling_customer MODIFY column vehicleModel varchar(50) DEFAULT NULL COMMENT '车辆型号' ; 
ALTER table bf_bip_renewaling_customer MODIFY column carOwner varchar(80) DEFAULT NULL COMMENT '车主';
ALTER table bf_bip_renewaling_customer MODIFY column insured varchar(80) DEFAULT NULL COMMENT '被保险人';
ALTER table bf_bip_renewaling_customer MODIFY column certificateNumber varchar(80) DEFAULT NULL COMMENT '被保险人证件号';
ALTER table bf_bip_renewaling_customer MODIFY column contact varchar(80)  NOT NULL COMMENT '联系人';
ALTER table bf_bip_renewaling_customer MODIFY column contactWay varchar(60)  NOT NULL COMMENT '联系方式';
ALTER table bf_bip_renewaling_customer MODIFY column insuranceCompLY varchar(50)  DEFAULT NULL COMMENT '去年保险公司';


/*修改bf_bip_insurance_bill的字段长度;2016-08-28*/
ALTER table bf_bip_insurance_bill MODIFY column vehicleModel varchar(50) DEFAULT NULL COMMENT '车辆型号' ; 
ALTER table bf_bip_insurance_bill MODIFY column insuranceCompName varchar(50) DEFAULT NULL COMMENT '保险公司' ; 
ALTER table bf_bip_insurance_bill MODIFY column carOwner varchar(80)  DEFAULT NULL COMMENT '车主'; 
ALTER table bf_bip_insurance_bill MODIFY column insured varchar(80)  DEFAULT NULL COMMENT '被保险人' ; 
ALTER table bf_bip_insurance_bill MODIFY column certificateNumber varchar(80)  DEFAULT NULL COMMENT '被保险人证件号' ; 
ALTER table bf_bip_insurance_bill MODIFY column contact varchar(80)  NOT NULL COMMENT '联系人' ; 
ALTER table bf_bip_insurance_bill MODIFY column contactWay varchar(60)  NOT NULL COMMENT '联系方式' ; 


/*修改bf_bip_customer_trace_recode的字段的长度;2016-08-28*/
ALTER table bf_bip_customer_trace_recode MODIFY column cx varchar(50) DEFAULT NULL COMMENT '车型' ; 
ALTER table bf_bip_customer_trace_recode MODIFY column lxr varchar(80) DEFAULT NULL COMMENT '联系人' ; 
ALTER table bf_bip_customer_trace_recode MODIFY column lxfs varchar(60)  DEFAULT NULL COMMENT '联系方式' ; 



/*修改bf_bip_approval_bill的字段的长度;2016-08-28*/
ALTER table bf_bip_approval_bill MODIFY column insured varchar(80) DEFAULT NULL COMMENT '被保险人';
ALTER table bf_bip_approval_bill MODIFY column bbxrzjh varchar(80) DEFAULT NULL COMMENT '被保险人证件号';
ALTER table bf_bip_approval_bill MODIFY column contact varchar(80)  DEFAULT NULL COMMENT '联系人' ; 
ALTER table bf_bip_approval_bill MODIFY column contactWay varchar(60)  DEFAULT NULL COMMENT '联系方式' ; 
ALTER table bf_bip_approval_bill MODIFY column insuranceCompName varchar(50) DEFAULT NULL COMMENT '保险公司' ; 


/*添加注释;2016-08-28*/
alter table bf_bip_insurance_bill modify column insuranceType varchar(512) DEFAULT NULL COMMENT '商业险险种';
alter table bf_bip_approval_bill modify column insurancTypes varchar(512) DEFAULT NULL COMMENT '商业险险种';

/*向店表添加多一个字段*/
alter table bf_bip_store add column importStatus int(1)  DEFAULT 0 COMMENT '店导入潜客状态，0为该店没有执行潜客导入，1为该店正在执行导入'; 

/*向用户表添加一个系统信息id字段;2016-08-31*/
ALTER TABLE bf_bip_user ADD COLUMN sysMessageId INT (11) DEFAULT NULL COMMENT '系统信息id';

/*添加系统消息表;2016-08-31*/
CREATE TABLE `bf_bip_systemMessage` (
	`sysMessageId` INT (11) NOT NULL AUTO_INCREMENT COMMENT 'sysMessageId',
	`content` VARCHAR (200) NOT NULL COMMENT '内容',
	`messageDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '消息时间',
	PRIMARY KEY (`sysMessageId`)
) ENGINE = INNODB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8;

/*添加新角色;2016-08-31*/
INSERT INTO bf_bip_role (roleId,roleName) VALUES (16,'数据分析员');

/*审批表中添加多一个字段;2016-09-09*/
alter table bf_bip_approval_bill add column remark varchar(200)  DEFAULT NULL COMMENT '备注' ;

/*4s店表中添加多一个字段;2016-09-12*/
alter table bf_bip_store add column vaildDate date  DEFAULT NULL COMMENT '店有效期' ;

/*向用户表添加一个登录uuid字段;2016-09-13; 支持另一个地方登录,原先的踢出功能*/
ALTER TABLE bf_bip_user ADD COLUMN loginUuId VARCHAR (50) DEFAULT NULL COMMENT '登录时生成的uuid';


/*
* 2016-09-14;向message表添加字段,支持个人信息,点击信息跳到跟踪处理界面功能
* 1. customerId 潜客id; 2. chassisNumber 车架号
*/
ALTER TABLE bf_bip_message ADD COLUMN customerId int (11) COMMENT '潜客id';
ALTER TABLE bf_bip_message ADD COLUMN chassisNumber VARCHAR (50) COMMENT '车架号';

/*添加系统消息表;2016-09-18*/
/*Table structure for table `bf_bip_customer_bj_recode` */
DROP TABLE IF EXISTS `bf_bip_customer_bj_recode`;

CREATE TABLE `bf_bip_customer_bj_recode` (
  `bjId` int(11) NOT NULL AUTO_INCREMENT COMMENT '报价id',
  `customerId` int(11) NOT NULL COMMENT '潜在客户id',
  `dcbjrq` datetime DEFAULT NULL COMMENT '当次报价日期',
  `bxgs` varchar(30) DEFAULT NULL COMMENT '保险公司',
  `xz` varchar(512) DEFAULT NULL COMMENT '险种',
  `syxje` float(11,2) DEFAULT '0.00' COMMENT '商业险金额',
  `jqxje` float(11,2) DEFAULT '0.00' COMMENT '交强险金额',
  `ccsje` float(11,2) DEFAULT '0.00' COMMENT '车船税金额',
  `bfhj` float(11,2) DEFAULT '0.00' COMMENT '保费合计',
  `jncdzk` float(11,2) DEFAULT '0.00' COMMENT '今年出单折扣',
  `cxcs` int(11) DEFAULT NULL COMMENT '出险次数',
  `lpje` float(11,2) DEFAULT '0.00' COMMENT '理赔金额',
  `bjr` varchar(20) DEFAULT NULL COMMENT '报价人',
  `bjrId` varchar(20) DEFAULT NULL COMMENT '报价人Id',
  `storeId` int(11) DEFAULT NULL COMMENT '4s店Id',
  PRIMARY KEY (`bjId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*20160928 添加审批单历史记录表，用于记录生成每张保单的携带的审批单，与审批单表的功能有本质上的区别*/
DROP TABLE IF EXISTS `bf_bip_approval_bill_record`;

CREATE TABLE `bf_bip_approval_bill_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '审批单自增id',
  `fourSStoreId` int(11) NOT NULL COMMENT '4s店id',
  `chassisNumber` varchar(50) DEFAULT NULL COMMENT '车架号',
  `jqxrqStart` date DEFAULT NULL COMMENT '保险到期日',
  `jqxrqEnd` date DEFAULT NULL COMMENT '保险到期日',
  `insurDate` date DEFAULT NULL COMMENT '投保日期',
  `renewalType` int(3) DEFAULT NULL COMMENT '投保类型',
  `renewalWay` varchar(20) DEFAULT NULL COMMENT '投保渠道',
  `solicitMember` varchar(20) DEFAULT NULL COMMENT '招揽员',
  `insured` varchar(80) DEFAULT NULL COMMENT '被保险人',
  `bbxrzjh` varchar(80) DEFAULT NULL COMMENT '被保险人证件号',
  `contact` varchar(80) DEFAULT NULL COMMENT '联系人',
  `contactWay` varchar(60) DEFAULT NULL COMMENT '联系方式',
  `insurancTypes` varchar(512) DEFAULT NULL COMMENT '商业险险种',
  `kpxx` varchar(200) DEFAULT NULL COMMENT '开票信息',
  `syxje` float(11,2) DEFAULT '0.00' COMMENT '商业险金额',
  `jqxje` float(11,2) DEFAULT '0.00' COMMENT '交强险金额',
  `ccs` float(11,2) DEFAULT '0.00' COMMENT '车船税',
  `bfhj` float(11,2) DEFAULT '0.00' COMMENT '保费合计',
  `kpje` float(11,2) DEFAULT '0.00' COMMENT '开票金额',
  `yhje` float(11,2) DEFAULT '0.00' COMMENT '优惠金额',
  `ssje` float(11,2) DEFAULT '0.00' COMMENT '实收金额',
  `fkfs` varchar(30) DEFAULT NULL COMMENT '付款方式',
  `insuranceCompName` varchar(50) DEFAULT NULL COMMENT '保险公司',
  `remark` varchar(200) DEFAULT NULL COMMENT '备注',
  `carLicenseNumber` varchar(30) DEFAULT NULL COMMENT '车牌号',
  `engineNumber` varchar(50) DEFAULT NULL COMMENT '发动机号',
  `carBrand` varchar(20) DEFAULT NULL COMMENT '汽车品牌',
  `vehicleModel` varchar(50) DEFAULT NULL COMMENT '车辆型号',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;


ALTER TABLE bf_bip_approval_bill ADD COLUMN carLicenseNumber varchar(30) DEFAULT NULL COMMENT '车牌号';

ALTER TABLE bf_bip_approval_bill ADD COLUMN engineNumber varchar(50) DEFAULT NULL COMMENT '发动机号';

ALTER TABLE bf_bip_approval_bill ADD COLUMN carBrand varchar(20) DEFAULT NULL COMMENT '汽车品牌';

ALTER TABLE bf_bip_approval_bill ADD COLUMN vehicleModel varchar(50) DEFAULT NULL COMMENT '车辆型号';

ALTER TABLE bf_bip_insurance_bill ADD COLUMN approvalBillId int(11) DEFAULT NULL COMMENT '历史审批单id';

/*20160929 系统用户增加两种角色，分别是店管理员，客服人员*/
insert  into `bf_bip_role`(`roleId`,`roleName`) values (17,'店管理员');
insert  into `bf_bip_role`(`roleId`,`roleName`) values (18,'客服人员');

/*
*2016-10-08 添加战败潜客表，用于接收bsp转移过来的战败的潜客
*/
DROP TABLE IF EXISTS `bf_bip_defeat_customer`;
CREATE TABLE `bf_bip_defeat_customer` (
  `bsp_userId` int(10) NOT NULL COMMENT '4s店ID',
  `contact` varchar(30) NOT NULL COMMENT '潜客名称',
  `contactWay` varchar(15) DEFAULT NULL COMMENT '潜客电话',
  `cause` varchar(50) DEFAULT NULL COMMENT '失销原因',
  `causeAnalysis` varchar(500) DEFAULT NULL COMMENT '失销分析',
  `failureTime` datetime DEFAULT NULL COMMENT '失销时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*
*2016-10-08 添加战败潜客关联表，用于记录接收的战败潜客的各种状态
*/
DROP TABLE IF EXISTS `bf_bip_defeat_customer_relate`;
CREATE TABLE `bf_bip_defeat_customer_relate` (
  `bsp_userId` int(10) NOT NULL COMMENT '4s店ID',
  `contactWay` varchar(15) NOT NULL COMMENT '潜客电话',
  `defeated` int(1) DEFAULT 0 COMMENT '是否战败',
  `deleted` int(1) DEFAULT 0 COMMENT '是否删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*
*2016-10-08 在审批单记录表添加索引
*/
ALTER TABLE bf_bip_approval_bill_record ADD INDEX chassisNumber_index (chassisNumber);
ALTER TABLE bf_bip_approval_bill_record ADD INDEX carLicenseNumber_index (carLicenseNumber);
ALTER TABLE bf_bip_approval_bill_record ADD INDEX contact_index (contact);
ALTER TABLE bf_bip_approval_bill_record ADD INDEX contactWay_index (contactWay);

/*
*2016-10-08 bsp店信息表
*/
DROP TABLE IF EXISTS `bf_bip_bspStore`;
CREATE TABLE `bf_bip_bspStore` (
  `bsp_storeId` int(10) NOT NULL COMMENT '4s店ID',
  `bsp_storeName` varchar(50) DEFAULT NULL COMMENT 'bsp店的名字'

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*
*2016-10-08 bsp店员工信息表
*/
DROP TABLE IF EXISTS `bf_bip_bspUser`;
CREATE TABLE `bf_bip_bspUser` (
  `bsp_userId` int(10) NOT NULL COMMENT '用户ID',
  `bsp_userName` varchar(20) DEFAULT NULL COMMENT 'bsp店用户名',
  `bsp_loginName` varchar(32) DEFAULT NULL COMMENT '4s店登录名',
  `bsp_userPosition` varchar(20) DEFAULT NULL COMMENT 'bsp店用户岗位',
  `bsp_storeId` int(10) DEFAULT NULL COMMENT 'bsp店的id'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*
*2016-10-09 在bip店表中添加bsp店的id字段和绑定时间，绑定状态，用于于bsp店的绑定
*/
ALTER TABLE bf_bip_store ADD COLUMN bspStoreId int(10) DEFAULT NULL COMMENT 'bsp店的id';

ALTER TABLE bf_bip_store ADD COLUMN bangTime dateTime DEFAULT NULL COMMENT '绑定时间';

ALTER TABLE bf_bip_store ADD COLUMN bangStatu int(1) DEFAULT 0 COMMENT '绑定状态';

/*
*2016-10-09 在bip用户表中添加bsp用户的id字段和绑定时间，绑定状态，用于于bsp用户的绑定
*/
ALTER TABLE bf_bip_user ADD COLUMN bspUserId int(10) DEFAULT NULL COMMENT 'bsp店用户的id';

ALTER TABLE bf_bip_user ADD COLUMN bangTime dateTime DEFAULT NULL COMMENT '绑定时间';

ALTER TABLE bf_bip_user ADD COLUMN bangStatu int(1) DEFAULT 0 COMMENT '绑定状态';

/*
*2016-10-19 将bf_bip_renewaling_customer表中的末次跟踪日期的date类型修改为dateTime类型，为了显示时分秒
*/
alter table bf_bip_renewaling_customer modify column lastTraceDate dateTime DEFAULT NULL COMMENT '末次跟踪日期';

/*
*2016-10-24 将bf_bip_defeat_customer和bf_bip_defeat_customer_relate表的字段名bsp_userId改为bsp_storeId
*/
alter table bf_bip_defeat_customer change bsp_userId bsp_storeId int(10) NOT NULL COMMENT '4s店ID';
alter table bf_bip_defeat_customer_relate change bsp_userId bsp_storeId int(10) NOT NULL COMMENT '4s店ID';

/*
*2016-10-26 新增客户默认为1，首次登陆修改了密码之后变为0
*/
ALTER TABLE bf_bip_user ADD COLUMN firstLogin int(1) DEFAULT 1 COMMENT '登陆状态';


/*
*2016-10-28 建议表
*/

DROP TABLE IF EXISTS `bf_bip_suggest`;

CREATE TABLE `bf_bip_suggest` (
  `id` int(7) NOT NULL AUTO_INCREMENT COMMENT '表自增id',
  `userId` int(10) DEFAULT NULL COMMENT '建议人id',
  `storeName` varchar(100) DEFAULT NULL COMMENT '建议人店铺名称',
  `userRoleName` varchar(50) DEFAULT NULL COMMENT '建议人角色名称',
  `userName` varchar(50) DEFAULT NULL COMMENT '建议人姓名',
  `userPhone` varchar(50) DEFAULT NULL COMMENT '建议人电话',
  `title` varchar(100) DEFAULT NULL COMMENT '建议标题',
  `content` varchar(500) DEFAULT NULL COMMENT '建议内容',
  `proposeTime` dateTime DEFAULT NULL COMMENT '提出时间',
  `status` int(1) DEFAULT 0 COMMENT '客服就问题的处理状态',
  `customId` int(10) DEFAULT NULL COMMENT '处理人id',
  `solveTime` dateTime DEFAULT NULL COMMENT '处理时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*
*2016-11-03 
*/
update bf_bip_user set firstLogin = 0 where `password` !='056386D3989FAD1A093B86BDFF527D51'


/*2016-11-15 存放邀约统计报表-邀约率的结果*/
DROP TABLE IF EXISTS bf_bip_report_day_invite;

CREATE TABLE bf_bip_report_day_invite (
  id int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  xId int DEFAULT NULL COMMENT 'x轴id',
  xName varchar(30) DEFAULT NULL COMMENT 'x轴名称',
  yId int(11) DEFAULT NULL COMMENT 'y轴id',
  yName varchar(30) DEFAULT NULL COMMENT 'y轴名称',
  stack int(5) DEFAULT NULL COMMENT '区域',
  stackName varchar(30) DEFAULT NULL COMMENT '区域名字',
  countValues DOUBLE DEFAULT 0 COMMENT '统计值',
  recordTime date DEFAULT NULL COMMENT '记录时间',
  storeId int(10) DEFAULT NULL COMMENT '店的id',
  PRIMARY KEY (id)

)ENGINE=InnoDB DEFAULT CHARSET=utf8 ;

/*
*2016-11-16
*/
ALTER TABLE `bf_bip_insurance_bill` ADD COLUMN `foundDate` dateTime DEFAULT NULL COMMENT '保单的创建时间';

/*
* 2016-11-16 存放潜客持有数统计报表的结果
*/
drop table if exists `bf_bip_report_month_customer_holder`;
create table `bf_bip_report_month_customer_holder`(
	`id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店Id',
	`storeName` VARCHAR(40) COMMENT '4s店名称',
	`roleId` int(11) comment '角色id',
	`xId` int(11) comment '横坐标id',
	`xName` VARCHAR(40) comment '横坐标名称',
	`yId` int(11) comment '纵坐标id',
	`yName` VARCHAR(40) comment '纵坐标名称',
	`countValues` int(11) comment '统计值',
	`stack` int(11),
	`stackName` VARCHAR(20),
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*
* 2016-11-16 跟踪记录表新增失销原因(lossReason)和回退原因(returnReason)两个字段,支持原因统计
*/
alter table bf_bip_customer_trace_recode add column lossReason varchar(40) DEFAULT null COMMENT '失销原因'; 
alter table bf_bip_customer_trace_recode add column returnReason varchar(40) DEFAULT null COMMENT '回退原因';


/*
* 2016-11-17 存放回退统计报表的结果
*/
drop table if exists `bf_bip_report_return_reason`;
create table `bf_bip_report_return_reason`(
	`id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店Id',
	`storeName` VARCHAR(40) COMMENT '4s店名称',
	`xId` int(11) comment '横坐标id',
	`xName` VARCHAR(40) comment '横坐标名称',
	`yId` int(11) comment '纵坐标id',
	`yName` VARCHAR(40) comment '纵坐标名称',
	`countValues` int(11) comment '统计值',
	`stack` int(11),
	`stackName` VARCHAR(20),
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*
* 2016-11-17 存放失销统计报表的结果
*/
drop table if exists `bf_bip_report_loss_reason`;
create table `bf_bip_report_loss_reason`(
	`id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店Id',
	`storeName` VARCHAR(40) COMMENT '4s店名称',
	`xId` int(11) comment '横坐标id',
	`xName` VARCHAR(40) comment '横坐标名称',
	`yId` int(11) comment '纵坐标id',
	`yName` VARCHAR(40) comment '纵坐标名称',
	`countValues` int(11) comment '统计值',
	`stack` int(11),
	`stackName` VARCHAR(20),
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



/*2016-11-22 存放续保率统计报表-当期续保率的结果*/
drop table if exists `bf_bip_report_day_xbltjbb_dqxbl`;
CREATE TABLE `bf_bip_report_day_xbltjbb_dqxbl` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `xId` int(11) DEFAULT NULL COMMENT 'x轴id',
  `xName` varchar(30) DEFAULT NULL COMMENT 'x轴名称',
  `yId` int(11) DEFAULT NULL COMMENT 'y轴id',
  `yName` varchar(30) DEFAULT NULL COMMENT 'y轴名称',
  `stack` int(5) DEFAULT NULL COMMENT '区域',
  `stackName` varchar(30) DEFAULT NULL COMMENT '区域名字',
  `countValues` double(10,2) DEFAULT '0.00' COMMENT '统计值',
  `recordTime` date DEFAULT NULL COMMENT '记录时间',
  `storeId` int(10) DEFAULT NULL COMMENT '店的id',
  PRIMARY KEY (`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*2016-11-22 存放续保率统计报表-综合续保率的结果*/
drop table if exists `bf_bip_report_day_xbltjbb_zhxbl`;
CREATE TABLE `bf_bip_report_day_xbltjbb_zhxbl` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `xId` int(11) DEFAULT NULL COMMENT 'x轴id',
  `xName` varchar(30) DEFAULT NULL COMMENT 'x轴名称',
  `yId` int(11) DEFAULT NULL COMMENT 'y轴id',
  `yName` varchar(30) DEFAULT NULL COMMENT 'y轴名称',
  `stack` int(5) DEFAULT NULL COMMENT '区域',
  `stackName` varchar(30) DEFAULT NULL COMMENT '区域名字',
  `countValues` double(10,2) DEFAULT '0.00' COMMENT '统计值',
  `recordTime` date DEFAULT NULL COMMENT '记录时间',
  `storeId` int(10) DEFAULT NULL COMMENT '店的id',
  PRIMARY KEY (`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*
* 2016-11-22 存放跟踪统计结果的表
*/
drop table if exists `bf_bip_report_day_trace_count`;
create table `bf_bip_report_day_trace_count`(
	`id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店Id',
	`storeName` VARCHAR(40) COMMENT '4s店名称',
	`userId` int(11) comment '用户id',
	`userName` VARCHAR(40) comment '用户名',
	`traceCount` int(11) comment '跟踪次数',
	`inviteCount` int(11) comment '发起邀约次数',
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*
* 2016-11-22 存放邀约到店（日报）统计结果的表
*/
drop table if exists `bf_bip_report_day_invite_comestore`;
create table `bf_bip_report_day_invite_comestore`(
	`id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店Id',
	`storeName` VARCHAR(40) COMMENT '4s店名称',
	`userId` int(11) comment '用户id',
	`userName` VARCHAR(40) comment '用户名',
	`inviteCount` int(11) comment '邀约今日到店人数',
	`comeStoreCount` int(11) comment '今日到店人数',
	`tomorrowInviteCount` int(11) comment '邀约明日到店人数',
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*
* 2016-11-22 保单记录表记录表负责人可为空
*/
alter table bf_bip_insurance_trace change principal principal varchar(20) default null COMMENT '负责人';


/*
* 2016-11-22 跟踪记录表新增进店时间字段
*/
alter table bf_bip_customer_trace_recode add column comeStoreDate datetime DEFAULT NULL COMMENT '进店时间'; 

/*
* 2016-11-24 存放出单统计(日报)的结果的表
*/
drop table if exists `bf_bip_report_day_insuranceBill_count`;
create table `bf_bip_report_day_insuranceBill_count`(
	`id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店Id',
	`storeName` VARCHAR(40) COMMENT '4s店名称',
	`insuranceCompId` int(11) comment '保险公司id',
	`insuranceCompName` VARCHAR(40) comment '保险公司名称',
	`jqxNewBillCount` int(11) comment '新保交强险出单数',
	`syxNewBillCount` int(11) comment '新保商业险出单数',
	`sumNewBillCount` int(11) comment '新保出单数合计',
	`jqxRenewalBillCount` int(11) comment '续保交强险出单数',
	`syxRenewalBillCount` int(11) comment '续保商业险出单数',
	`sumRenewalBillCount` int(11) comment '续保出单数合计',
	`jqxNewBillPremium` DOUBLE(16,2) comment '新保交强险保费',
	`syxNewBillPremium` DOUBLE(16,2) comment '新保商业险保费',
	`sumNewBillPremium` DOUBLE(16,2) comment '新保保费合计',
	`jqxRenewalBillPremium` DOUBLE(16,2) comment '续保交强险保费',
	`syxRenewalBillPremium` DOUBLE(16,2) comment '续保商业险保费',
	`sumRenewalBillPremium` DOUBLE(16,2) comment '续保保费合计',
	`jqxNewBillHandlingRate` DOUBLE(16,2) comment '新保交强险手续费率',
	`syxNewBillHandlingRate` DOUBLE(16,2) comment '新保商业险手续费率',
	`jqxRenewalBillHandlingRate` DOUBLE(16,2) comment '续保交强险手续费率',
	`syxRenewalBillHandlingRate` DOUBLE(16,2) comment '续保商业险手续费率',
	`jqxNewBillHandlingAmount` DOUBLE(16,2) comment '新保交强险手续费金额',
	`syxNewBillHandlingAmount` DOUBLE(16,2) comment '新保商业险手续费金额',
	`sumNewBillHandlingAmount` DOUBLE(16,2) comment '新保手续费金额合计',
	`jqxRenewalBillHandlingAmount` DOUBLE(16,2) comment '续保交强险手续费金额',
	`syxRenewalBillHandlingAmount` DOUBLE(16,2) comment '续保商业险手续费金额',
	`sumRenewalBillHandlingAmount` DOUBLE(16,2) comment '续保手续费金额合计',
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*
* 2016-11-28 修改消息表(bf_bip_message),messageDate字段不随着记录更新而更新
*/
ALTER table bf_bip_message MODIFY column messageDate timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '消息发送时间'; 

/*
* 2016-12-02   查询壁虎的保险到期日存放字段
*/
alter table bf_bip_customer add bhInsuranceEndDate date DEFAULT NULL COMMENT '壁虎交强险到期日';
alter table bf_bip_renewaling_customer add bhInsuranceEndDate date DEFAULT NULL COMMENT '壁虎交强险到期日';

/*
* 2016-12-05 修改潜客表(bf_bip_customer),新增一个字段,表示潜客创建时间
*/
ALTER TABLE bf_bip_customer ADD COLUMN createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';

/*
* 2016-12-05 修改4s店表(bf_bip_store),新增一个字段表示是否支持壁虎对接
*/
ALTER TABLE bf_bip_store ADD COLUMN bhDock int(3) DEFAULT '0' COMMENT '是否支持壁虎对接,0表示不支持,1表示支持';

/*
* 2016-12-08 存放根据壁虎信息修改过的潜客修改前的数据
*/
drop table if exists `bf_bip_customer_update_bihu`;
CREATE TABLE `bf_bip_customer_update_bihu` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '潜在客户id',
  `customerId` int(11) NOT NULL COMMENT '潜在客户id',
  `fourSStoreId` int(11) DEFAULT NULL COMMENT '4s店id',
  `fourSStore` varchar(50) DEFAULT NULL COMMENT '4s店',
  `carLicenseNumber` varchar(30) DEFAULT NULL COMMENT '车牌号',
  `chassisNumber` varchar(50) DEFAULT NULL COMMENT '车架号',
  `engineNumber` varchar(50) DEFAULT NULL COMMENT '发动机号',
  `registrationDate` date DEFAULT NULL COMMENT '上牌日期',
  `carBrand` varchar(20) DEFAULT NULL COMMENT '汽车品牌',
  `vehicleModel` varchar(50) DEFAULT NULL COMMENT '车辆型号',
  `syxrqEnd` date DEFAULT NULL COMMENT '商业险到期日',
  `insuranceEndDate` date NOT NULL COMMENT '交强险到期日',
  `renewalType` int(3) NOT NULL COMMENT '投保类型',
  `renewalWay` varchar(20) DEFAULT NULL COMMENT '续保渠道',
  `insurDateLY` date DEFAULT NULL COMMENT '去年投保日期',
  `insuranceCompLY` varchar(50) DEFAULT NULL COMMENT '去年保险公司',
  `privilegeProLY` varchar(30) DEFAULT NULL COMMENT '去年优惠项目',
  `insuranceTypeLY` varchar(200) DEFAULT NULL COMMENT '去年投保险种',
  `remark` varchar(200) DEFAULT NULL COMMENT '备注',
  `carOwner` varchar(80) DEFAULT NULL COMMENT '车主',
  `insured` varchar(80) DEFAULT NULL COMMENT '被保险人',
  `certificateNumber` varchar(80) DEFAULT NULL COMMENT '被保险人证件号',
  `customerLevel` varchar(10) DEFAULT 'A' COMMENT '客户级别',
  `contact` varchar(80) NOT NULL COMMENT '联系人',
  `contactWay` varchar(60) NOT NULL COMMENT '联系方式',
  `address` varchar(100) DEFAULT NULL COMMENT '现地址',
  `isMaintainAgain` int(1) DEFAULT NULL COMMENT '是否本店再维修客户 0:表示“否”；1表示“是”',
  `maintainNumberLY` int(3) DEFAULT NULL COMMENT '去年本店维修次数',
  `accidentNumberLY` int(3) DEFAULT NULL COMMENT '去年出险次数',
  `accidentOutputValueLY` int(11) DEFAULT NULL COMMENT '去年本店事故生产值',
  `serviceConsultantId` varchar(20) DEFAULT NULL COMMENT '服务顾问',
  `serviceConsultant` varchar(20) DEFAULT NULL COMMENT '服务顾问',
  `customerSource` varchar(20) DEFAULT NULL COMMENT '客户来源',
  `customerCharacter` varchar(20) DEFAULT NULL COMMENT '客户性质',
  `sfgyx` int(1) DEFAULT NULL COMMENT '是否高意向 0:表示“否”；1表示“是”',
  `customerDescription` varchar(100) DEFAULT NULL COMMENT '客户描述',
  `insuranceNumber` varchar(30) DEFAULT NULL COMMENT '保单号',
  `solicitMemberLY` varchar(20) DEFAULT NULL COMMENT '去年招揽员',
  `insurNumber` int(3) DEFAULT NULL COMMENT '本店投保次数',
  `insuranceCoverageLY` float(11,2) DEFAULT '0.00' COMMENT '去年投保保额',
  `principalId` int(3) DEFAULT NULL COMMENT '当前负责人id',
  `principal` varchar(30) DEFAULT NULL COMMENT '当前负责人',
  `virtualJqxdqr` date NOT NULL COMMENT '虚拟的交强险到期日',
  `status` int(3) DEFAULT '1' COMMENT '是否分配状态,1表示未分配,2表示已分配',
  `clerk` varchar(30) DEFAULT NULL COMMENT '业务员',
  `clerkId` int(7) DEFAULT NULL COMMENT '业务员id',
  `lastYearIsDeal` int(3) DEFAULT '0' COMMENT '上一年是否成交保单，1代表是，0代表否',
  `cusLostInsurStatu` int(3) DEFAULT NULL COMMENT '潜客脱保状态',
  `bhInsuranceEndDate` date DEFAULT NULL COMMENT '壁虎交强险到期日',
  `updateDate` date DEFAULT NULL COMMENT '修改日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE bf_bip_customer ADD COLUMN ifUpdate int(1) DEFAULT 1 COMMENT '是否根据壁虎的信息更新，1代表更新，0代表不更新';
ALTER TABLE bf_bip_renewaling_customer ADD COLUMN ifUpdate int(1) DEFAULT 1 COMMENT '是否根据壁虎的信息更新，1代表更新，0代表不更新';

/*
* 2016-12-06 修改老的报价表(bf_bip_customer_bj_recode),新增一个字段表示备注
*/
ALTER TABLE bf_bip_customer_bj_recode ADD COLUMN remark VARCHAR(1024) DEFAULT NULL COMMENT '备注';


/*
* 2016-12-07 修改老的报价表(bf_bip_customer_bj_recode),新增与壁虎对接的字段
*/
ALTER TABLE bf_bip_customer_bj_recode ADD COLUMN rateFactor1 float(11,2) DEFAULT NULL COMMENT '费率系数1（无赔款优惠系数）';
ALTER TABLE bf_bip_customer_bj_recode ADD COLUMN rateFactor2 float(11,2) DEFAULT NULL COMMENT '费率系数2（自主渠道系数）';
ALTER TABLE bf_bip_customer_bj_recode ADD COLUMN rateFactor3 float(11,2) DEFAULT NULL COMMENT '费率系数3（自主核保系数）';
ALTER TABLE bf_bip_customer_bj_recode ADD COLUMN rateFactor4 float(11,2) DEFAULT NULL COMMENT '费率系数4（交通违法浮动系数）';
ALTER TABLE bf_bip_customer_bj_recode ADD COLUMN quoteResult VARCHAR(512) DEFAULT NULL COMMENT '报价信息';
ALTER TABLE bf_bip_customer_bj_recode ADD COLUMN quoteStatus int(10) DEFAULT NULL COMMENT '报价状态，-1=未报价， 0=报价失败，>0报价成功';
ALTER TABLE bf_bip_customer_bj_recode ADD COLUMN source int(10) DEFAULT NULL COMMENT '保险资源枚举';
ALTER TABLE bf_bip_customer_bj_recode ADD COLUMN bjfs int(3) DEFAULT 0 COMMENT '报价方式，默认为0，0=老报价，1=壁虎报价';

/*2016-12-08 存放邀约统计报表-邀约率的结果表的countValues的长度保留两位小数点*/
ALTER TABLE bf_bip_report_day_invite MODIFY COLUMN countValues double(10,2) DEFAULT '0.00' COMMENT '统计值';

/*2016-12-08 保险公司表添加壁虎保险资源枚举字段*/
ALTER TABLE bf_bip_insurance_company ADD COLUMN source int DEFAULT null COMMENT '壁虎保险资源枚举';

/*2016-12-08 创建核保表*/
drop table if exists `bf_bip_underwriting`;
create table `bf_bip_underwriting`(
	`id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`source` int(32) DEFAULT NULL COMMENT '壁虎保险资源枚举',
	`submitStatus` int(32) DEFAULT NULL COMMENT '核保状态',
	`submitResult` VARCHAR(200) DEFAULT NULL COMMENT '核保状态描述',
	`bizNo` VARCHAR(40) DEFAULT NULL COMMENT '商业险投保单号',
	`forceNo` VARCHAR(40) DEFAULT NULL COMMENT '交强险投保单号',
	`bizRate` DOUBLE(10,2) DEFAULT NULL COMMENT '商业险费率（核保通过才会有值）',
	`forceRate` DOUBLE(10,2) DEFAULT NULL COMMENT '交强车船险费率（核保通过之后才会有值）',
	`storeId` INT(11) DEFAULT NULL COMMENT '店id',
    `customerId` int(11) DEFAULT NULL COMMENT '潜客id',
    `bjId` int(11) DEFAULT NULL COMMENT '报价id',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*
* 2016-12-08 修改4s店表(bf_bip_store),新增一个字段表示壁虎渠道码
*/
ALTER TABLE bf_bip_store ADD COLUMN agent VARCHAR(32) DEFAULT NULL COMMENT '壁虎渠道码';

/*
* 2016-12-08 自动更新的时候查询的偏移量
*/
ALTER TABLE bf_bip_store ADD COLUMN deviation int(7) DEFAULT 0 COMMENT '自动更新的时候查询的偏移量';

/*2016-12-09 在潜客跟踪记录表添加虚拟保险到期日字段*/
ALTER TABLE bf_bip_customer_trace_recode ADD COLUMN virtualJqxdqr date DEFAULT null COMMENT '虚拟保险到期日';

/*
*2016-12-12 更新保险公司表source值
*/
UPDATE bf_bip_insurance_company SET source=4 where insuranceCompId=49;
UPDATE bf_bip_insurance_company SET source=2 where insuranceCompId=50;
UPDATE bf_bip_insurance_company SET source=1 where insuranceCompId=51;
UPDATE bf_bip_insurance_company SET source=8 where insuranceCompId=52;
UPDATE bf_bip_insurance_company SET source=16 where insuranceCompId=53;
UPDATE bf_bip_insurance_company SET source=32 where insuranceCompId=54;
UPDATE bf_bip_insurance_company SET source=64 where insuranceCompId=55;
UPDATE bf_bip_insurance_company SET source=128 where insuranceCompId=56;
UPDATE bf_bip_insurance_company SET source=256 where insuranceCompId=61;
UPDATE bf_bip_insurance_company SET source=512 where insuranceCompId=59;
UPDATE bf_bip_insurance_company SET source=1024 where insuranceCompId=65;

/*
*2016-12-12 修改所有表的remark字段的长度相关字段的长度
*/
alter table bf_bip_approval_bill modify column remark varchar(512) DEFAULT NULL COMMENT '备注';
alter table bf_bip_approval_bill_record modify column remark varchar(512) DEFAULT NULL COMMENT '备注';
alter table bf_bip_carbrand modify column remark varchar(512) DEFAULT NULL COMMENT '备注';
alter table bf_bip_carmodel modify column remark varchar(512) DEFAULT NULL COMMENT '备注';
alter table bf_bip_customer modify column remark varchar(512) DEFAULT NULL COMMENT '备注';
alter table bf_bip_customer_trace_recode modify column traceContext varchar(1024) NOT NULL COMMENT '跟踪内容';
alter table bf_bip_insurance_bill modify column remark varchar(512) DEFAULT NULL COMMENT '备注';
alter table bf_bip_insurance_company modify column remark varchar(512) DEFAULT NULL COMMENT '备注';
alter table bf_bip_insurance_trace modify column remark varchar(512) DEFAULT NULL COMMENT '备注';
alter table bf_bip_insurance_trace_recode modify column traceContext varchar(512) DEFAULT NULL COMMENT '跟踪内容';
alter table bf_bip_insurance_type modify column remark varchar(512) DEFAULT NULL COMMENT '备注';
alter table bf_bip_message modify column remark varchar(512) DEFAULT NULL COMMENT '备注';
alter table bf_bip_renewaling_customer modify column remark varchar(512) DEFAULT NULL COMMENT '备注';
alter table bf_bip_renewaling_customer modify column lastTraceResult varchar(1024) DEFAULT NULL COMMENT '末次跟踪结果';
alter table bf_bip_store modify column remark varchar(512) DEFAULT NULL COMMENT '备注';
alter table bf_bip_user modify column remark varchar(512) DEFAULT NULL COMMENT '备注';


/*2016-12-13 存放邀约统计报表-到店率的结果*/
drop table if exists `bf_bip_report_day_comestore`;
CREATE TABLE `bf_bip_report_day_comestore` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `xId` int(11) DEFAULT NULL COMMENT 'x轴id',
  `xName` varchar(30) DEFAULT NULL COMMENT 'x轴名称',
  `yId` int(11) DEFAULT NULL COMMENT 'y轴id',
  `yName` varchar(30) DEFAULT NULL COMMENT 'y轴名称',
  `stack` int(5) DEFAULT NULL COMMENT '区域',
  `stackName` varchar(30) DEFAULT NULL COMMENT '区域名字',
  `countValues` double(10,2) DEFAULT '0.00' COMMENT '统计值',
  `recordTime` date DEFAULT NULL COMMENT '记录时间',
  `storeId` int(10) DEFAULT NULL COMMENT '店的id',
  `statisticalTime` date DEFAULT NULL COMMENT '统计时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*
* 2016-12-14 修改老的报价表(bf_bip_customer_bj_recode),新增与壁虎对接的字段
*/
ALTER TABLE bf_bip_customer_bj_recode ADD COLUMN yhje float(11,2) DEFAULT NULL COMMENT '优惠金额';
alter table bf_bip_customer_bj_recode modify column xz varchar(2000) DEFAULT NULL COMMENT '险种';

/*
* 2016-12-16 修改保单表(bf_bip_insurance_bill),关于金额的字段使用double类型
*/
ALTER table bf_bip_insurance_bill MODIFY column binsuranceCoverage double(20,2) DEFAULT '0.00' COMMENT '商业险保额';
ALTER table bf_bip_insurance_bill MODIFY column vehicleTax double(20,2) DEFAULT '0.00' COMMENT '车船税金额';
ALTER table bf_bip_insurance_bill MODIFY column cinsuranceCoverage double(20,2) DEFAULT '0.00' COMMENT '交强险保额';
ALTER table bf_bip_insurance_bill MODIFY column premiumCount double(20,2) DEFAULT '0.00' COMMENT '保费合计';
ALTER table bf_bip_insurance_bill MODIFY column privilegeSum double(20,2) DEFAULT '0.00' COMMENT '优惠金额';
ALTER table bf_bip_insurance_bill MODIFY column donateCostCount double(20,2) DEFAULT '0.00' COMMENT '赠送成本合计';
ALTER table bf_bip_insurance_bill MODIFY column factorageCount double(20,2) DEFAULT '0.00' COMMENT '手续费合计';
ALTER table bf_bip_insurance_bill MODIFY column realPay double(20,2) DEFAULT '0.00' COMMENT '实收金额';
ALTER table bf_bip_insurance_bill MODIFY column profit double(20,2) DEFAULT '0.00' COMMENT '利润';
ALTER table bf_bip_insurance_bill MODIFY column qnbe double(20,2) DEFAULT '0.00' COMMENT '去年保额';
ALTER table bf_bip_insurance_bill MODIFY column qnsyxje double(20,2) DEFAULT '0.00' COMMENT '去年商业险金额';
ALTER table bf_bip_insurance_bill MODIFY column qnjqxje double(20,2) DEFAULT '0.00' COMMENT '去年交强险金额';
ALTER table bf_bip_insurance_bill MODIFY column qnccsje double(20,2) DEFAULT '0.00' COMMENT '去年车船税金额';

/*
* 2016-12-16 修改大小池子潜客表,去年投保额字段使用double类型
*/
ALTER table bf_bip_customer MODIFY column insuranceCoverageLY double(20,2) DEFAULT '0.00' COMMENT '去年投保保额';
ALTER table bf_bip_renewaling_customer MODIFY column insuranceCoverageLY double(20,2) DEFAULT '0.00' COMMENT '去年投保保额';

ALTER table bf_bip_customer MODIFY column insuranceTypeLY VARCHAR(1024) DEFAULT NULL COMMENT '去年投保险种';
ALTER table bf_bip_renewaling_customer MODIFY column insuranceTypeLY VARCHAR(1024) DEFAULT NULL COMMENT '去年投保险种';

/*
* 2016-12-18 修改壁虎是否更新默认值
*/
update bf_bip_customer set ifUpdate = 0;
update bf_bip_renewaling_customer set ifUpdate = 0;
alter table bf_bip_customer modify column ifUpdate int(1) DEFAULT 0 COMMENT '是否根据壁虎的信息更新，1代表更新，0代表不更新';
alter table bf_bip_renewaling_customer modify column ifUpdate int(1) DEFAULT 0 COMMENT '是否根据壁虎的信息更新，1代表更新，0代表不更新';

/*
* 2016-12-20 修改潜客表(bf_bip_customer),新增一个字段表示建档人
*/
ALTER TABLE bf_bip_customer ADD COLUMN createrId int(11) DEFAULT NULL COMMENT '建档人id';
/*
* 2016-12-20 潜客表的建档人创建索引
*/
ALTER TABLE `bf_bip_customer` ADD INDEX createrId_index( `createrId` );

/*

*2016-12-27 补充将bf_bip_customer和bf_bip_renewaling_customer的脱保状态字段默认值修改为0的sql语句
*/
alter table bf_bip_customer MODIFY COLUMN `cusLostInsurStatu` int(3) DEFAULT 0 COMMENT '潜客脱保状态';
alter table bf_bip_renewaling_customer MODIFY COLUMN `cusLostInsurStatu` int(3) DEFAULT 0 COMMENT '潜客脱保状态';

/*
* 2016-12-27 修改4s店表(bf_bip_store),新增一个字段表示是否锁死级别
*/
ALTER TABLE bf_bip_store ADD COLUMN lockLevel int(3) DEFAULT 0 COMMENT '是否锁死级别,0表示否,1表示是';

/*2016-12-27 存放调用壁虎接口信息*/
drop table if exists `bf_bip_sent_bihu_info`;
CREATE TABLE `bf_bip_sent_bihu_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `storeId` int(11) DEFAULT NULL COMMENT '店id',
  `userId` int(11) DEFAULT NULL COMMENT '用户id',
  `agent` varchar(32) DEFAULT NULL COMMENT '壁虎渠道码',
  `transferTime` datetime DEFAULT NULL COMMENT '调用时间',
  `transferType` int(3) DEFAULT 0 COMMENT '调用类型,默认为0,1:查询续保,2:发起报价,3:获取报价,4:获取核保,5:获取出险',
  `licenseNo` varchar(20) DEFAULT NULL COMMENT '车牌号',
  `engineNo` varchar(50) DEFAULT NULL COMMENT '发动机号',
  `carVin` varchar(50) DEFAULT NULL COMMENT '车架号',
  `custKey` varchar(32) DEFAULT NULL COMMENT '客户端标识',
  `source` int(10) DEFAULT NULL COMMENT '壁虎保险资源枚举',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*
* 2016-12-28 统计所有潜客数,潜客持有数改成持有潜客数,修复历史数据
*/
update bf_bip_report_month_customer_holder set yName = '持有潜客数' where yName = '潜客持有数';

/*
* 2017-01-10 给bf_bip_defeat_customer和bf_bip_defeat_customer_relate表添加索引 (1月10号已经执行)
*/
ALTER TABLE `bf_bip_defeat_customer` ADD INDEX defeat_customer_bsp_storeId ( `bsp_storeId` ) ;
ALTER TABLE `bf_bip_defeat_customer` ADD INDEX defeat_customer_contactWay ( `contactWay` ) ;
ALTER TABLE `bf_bip_defeat_customer_relate` ADD INDEX defeat_customer_relate_bsp_storeId ( `bsp_storeId` ) ;
ALTER TABLE `bf_bip_defeat_customer_relate` ADD INDEX defeat_customer_relate_contactWay ( `contactWay` ) ;

/*
* 2017-01-16 修改老的报价表(bf_bip_customer_bj_recode),新增实际金额字段
*/
ALTER TABLE bf_bip_customer_bj_recode ADD COLUMN shijize float(11,2) DEFAULT NULL COMMENT '实际金额';

/*
*2017-01-22 操作记录表添加虚拟保险到期日
*/
ALTER TABLE bf_bip_operation_record ADD COLUMN virtualJqxdqr date DEFAULT NULL COMMENT '虚拟保险到期日';
/*
*2017-01-22 操作记录表添加虚拟保险到期日的索引
*/
ALTER TABLE `bf_bip_operation_record` ADD INDEX virtualJqxdqr_index( `virtualJqxdqr` );
/*
*2017-02-06 保单交强险开始和结束日期可以为空
*/
ALTER TABLE bf_bip_insurance_bill MODIFY COLUMN jqxrqStart date DEFAULT NULL COMMENT '交强险开始日期';
ALTER TABLE bf_bip_insurance_bill MODIFY COLUMN jqxrqEnd date DEFAULT NULL COMMENT '交强险结束日期';


/*
*2017-02-10 大池子添加4个字段
*/
ALTER TABLE bf_bip_customer ADD COLUMN factoryLicenseType varchar(50) DEFAULT NULL COMMENT '厂牌型号';
ALTER TABLE bf_bip_customer ADD COLUMN carAnnualCheckUpDate date DEFAULT NULL COMMENT '车辆年审日期';
ALTER TABLE bf_bip_customer ADD COLUMN insuredLY varchar(30) DEFAULT NULL COMMENT '去年被保险人';
ALTER TABLE bf_bip_customer ADD COLUMN buyfromThisStore int(1) DEFAULT NULL COMMENT '是否本店购买车辆';

/*
*2017-02-10 小池子添加4个字段
*/
ALTER TABLE bf_bip_renewaling_customer ADD COLUMN factoryLicenseType varchar(50) DEFAULT NULL COMMENT '厂牌型号';
ALTER TABLE bf_bip_renewaling_customer ADD COLUMN carAnnualCheckUpDate date DEFAULT NULL COMMENT '车辆年审日期';
ALTER TABLE bf_bip_renewaling_customer ADD COLUMN insuredLY varchar(30) DEFAULT NULL COMMENT '去年被保险人';
ALTER TABLE bf_bip_renewaling_customer ADD COLUMN buyfromThisStore int(1) DEFAULT NULL COMMENT '是否本店购买车辆';

/*
*2017-02-10 保留壁虎潜客信息表添加4个字段
*/
ALTER TABLE bf_bip_customer_update_bihu ADD COLUMN factoryLicenseType varchar(50) DEFAULT NULL COMMENT '厂牌型号';
ALTER TABLE bf_bip_customer_update_bihu ADD COLUMN carAnnualCheckUpDate date DEFAULT NULL COMMENT '车辆年审日期';
ALTER TABLE bf_bip_customer_update_bihu ADD COLUMN insuredLY varchar(30) DEFAULT NULL COMMENT '去年被保险人';
ALTER TABLE bf_bip_customer_update_bihu ADD COLUMN buyfromThisStore int(1) DEFAULT NULL COMMENT '是否本店购买车辆';

/*
*2017-02-10 大池子添加接通次数字段
*/
ALTER TABLE bf_bip_customer ADD COLUMN gotThroughNum int(5) DEFAULT 0 COMMENT '接通次数';
/*
*2017-02-10 大池子添加接通次数字段
*/

ALTER TABLE bf_bip_renewaling_customer ADD COLUMN gotThroughNum int(5) DEFAULT 0 COMMENT '接通次数';

/*
*2017-02-10 审批单增加厂牌型号字段
*/
ALTER TABLE bf_bip_approval_bill ADD COLUMN factoryLicenseType VARCHAR(50) DEFAULT NULL COMMENT '厂牌型号';

/*
*2017-02-10 审批单历史记录表增加厂牌型号字段
*/
ALTER TABLE bf_bip_approval_bill_record ADD COLUMN factoryLicenseType VARCHAR(50) DEFAULT NULL COMMENT '厂牌型号';

/*
*2017-02-13 保单表增加
*/
ALTER TABLE bf_bip_insurance_bill ADD COLUMN sfdk int(3) DEFAULT null COMMENT '是否贷款';

/*
*2017-02-14 添加备用联系人字段
*/
ALTER TABLE bf_bip_customer ADD COLUMN contactWayReserve varchar(60) DEFAULT NULL COMMENT '备用联系方式';
ALTER TABLE bf_bip_renewaling_customer ADD COLUMN contactWayReserve varchar(60) DEFAULT NULL COMMENT '备用联系方式';
ALTER TABLE bf_bip_customer_update_bihu ADD COLUMN contactWayReserve varchar(60) DEFAULT NULL COMMENT '备用联系方式';

/*
*2017-02-15 在分配表添加申请延期日期字段
*/
ALTER TABLE bf_bip_customer_assign ADD COLUMN applyDelayDay date DEFAULT NULL COMMENT '申请延期日期';

/*
* 2017-02-20 修改4s店表(bf_bip_store),新增一个字段表示壁虎密钥
*/
ALTER TABLE bf_bip_store ADD COLUMN bihuKey VARCHAR(32) DEFAULT NULL COMMENT '壁虎密钥';

/*
*  2017-03-01 添加是否贷款字段
*/
ALTER TABLE bf_bip_customer ADD COLUMN ifLoan int(1) DEFAULT NULL COMMENT '是否贷款,1表示是,2表示否';
ALTER TABLE bf_bip_renewaling_customer ADD COLUMN ifLoan int(1) DEFAULT NULL COMMENT '是否贷款,1表示是,2表示否';

/*
*  2017-03-07 修改跟踪记录表(bf_bip_customer_trace_recode),新增一个字段表示操作人id
*/
ALTER TABLE bf_bip_customer_trace_recode ADD COLUMN operatorID int(11) DEFAULT NULL COMMENT '操作人id';

/*
* 2017-03-08
*/
ALTER TABLE bf_bip_customer ADD COLUMN bxInfo varchar(1000) DEFAULT NULL COMMENT '壁虎查询的保险信息';

/*
* 2017-03-09 修改4s店表(bf_bip_store),新增一个字段表示城市码
*/
ALTER TABLE bf_bip_store ADD COLUMN cityCode VARCHAR(32) DEFAULT NULL COMMENT '城市码';

/*
* 2017-03-13 新增四个KPI日报表,bf_bip_report_day_kpi_xbzy(KPI按续保专员),bf_bip_report_day_kpi_xbzy_detail(续保专员明细)
* 	bf_bip_report_day_kpi_cdy(KPI按出单员),bf_bip_report_day_kpi_cover_type(KPI按投保类型)
*/
drop table if exists `bf_bip_report_day_kpi_xbzy`;
CREATE TABLE `bf_bip_report_day_kpi_xbzy` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店Id',
	`storeName` VARCHAR(40) COMMENT '4s店名称',
	`userId` int(11) comment '用户id',
	`userName` VARCHAR(40) comment '用户名',
	`traceCount` int(11) comment '跟踪人数',
	`inviteCount` int(11) comment '发起邀约人数',
	`comeStoreCount` int(11) comment '邀约到店人数',
	`xbcs` int(11) comment '续保车数',
	`syxcds` int(11) comment '商业险出单数(不含单三者)',
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_day_kpi_xbzy` ADD INDEX report_day_kpi_xbzy_storeId_index( `storeId` );

drop table if exists `bf_bip_report_day_kpi_xbzy_detail`;
CREATE TABLE `bf_bip_report_day_kpi_xbzy_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店Id',
	`userId` int(11) comment '用户id',
	`userName` VARCHAR(40) comment '用户名',
	`newgzrs` int(11) comment '新转续跟踪人数',
	`renewgzrs` int(11) comment '续转续跟踪人数',
	`jzxgzrs` int(11) comment '间转续跟踪人数',
	`qzxgzrs` int(11) comment '潜转续跟踪人数',
	`scgzrs` int(11) comment '首次跟踪人数',
	`newyyrs` int(11) comment '新转续邀约人数',
	`renewyyrs` int(11) comment '续转续邀约人数',
	`jzxyyrs` int(11) comment '间转续邀约人数',
	`qzxyyrs` int(11) comment '潜转续邀约人数',
	`scyyrs` int(11) comment '首次邀约人数',
	`newyyddrs` int(11) comment '新转续邀约到店人数',
	`renewyyddrs` int(11) comment '续转续邀约到店人数',
	`jzxyyddrs` int(11) comment '间转续邀约到店人数',
	`qzxyyddrs` int(11) comment '潜转续邀约到店人数',
	`scyyddrs` int(11) comment '首次邀约到店人数',
	`newxbcs` int(11) comment '新转续续保车数',
	`renewxbcs` int(11) comment '续转续续保车数',
	`jzxxbcs` int(11) comment '间转续续保车数',
	`qzxxbcs` int(11) comment '潜转续续保车数',
	`scxbcs` int(11) comment '首次续保车数',
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_day_kpi_xbzy_detail` ADD INDEX report_day_kpi_xbzy_detail_storeId_index( `storeId` );
ALTER TABLE `bf_bip_report_day_kpi_xbzy_detail` ADD INDEX report_day_kpi_xbzy_detail_userId_index( `userId` );

drop table if exists `bf_bip_report_day_kpi_cdy`;
CREATE TABLE `bf_bip_report_day_kpi_cdy` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店Id',
	`storeName` VARCHAR(40) COMMENT '4s店名称',
	`userId` int(11) comment '用户id',
	`userName` VARCHAR(40) comment '用户名',
	`jdrs` int(11) comment '接待人数(实际到店人数)',
	`xbcs` int(11) comment '续保车数',
	`cds` int(11) comment '出单数',
	`syxcds` int(11) comment '商业险出单数(不含单三者)',
	`bfhj` DOUBLE(16,2) comment '保费合计(元)',
	`syxbfhj` DOUBLE(16,2) comment '商业险保费合计(不含单三者,元)',
	`syxdjbf` DOUBLE(16,2) comment '商业险单均保费(不含单三者,元)',
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_day_kpi_cdy` ADD INDEX report_day_kpi_cdy_storeId_index( `storeId` );

drop table if exists `bf_bip_report_day_kpi_cover_type`;
CREATE TABLE `bf_bip_report_day_kpi_cover_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店Id',
	`newsjddrs` int(11) comment '新转续实际到店人数',
	`renewsjddrs` int(11) comment '续转续实际到店人数',
	`jzxsjddrs` int(11) comment '间转续实际到店人数',
	`qzxsjddrs` int(11) comment '潜转续实际到店人数',
	`scsjddrs` int(11) comment '首次实际到店人数',
	`newyyddrs` int(11) comment '新转续邀约到店人数',
	`renewyyddrs` int(11) comment '续转续邀约到店人数',
	`jzxyyddrs` int(11) comment '间转续邀约到店人数',
	`qzxyyddrs` int(11) comment '潜转续邀约到店人数',
	`scyyddrs` int(11) comment '首次邀约到店人数',
	`newsyxcds` int(11) comment '新转续N月到期商业险出单',
	`renewsyxcds` int(11) comment '续转续N月到期商业险出单',
	`jzxsyxcds` int(11) comment '间转续N月到期商业险出单',
	`qzxsyxcds` int(11) comment '潜转续N月到期商业险出单',
	`scsyxcds` int(11) comment '首次N月到期商业险出单',
	`newsyxcds1` int(11) comment '新转续N+1月到期商业险出单',
	`renewsyxcds1` int(11) comment '续转续N+1月到期商业险出单',
	`jzxsyxcds1` int(11) comment '间转续N+1月到期商业险出单',
	`qzxsyxcds1` int(11) comment '潜转续N+1月到期商业险出单',
	`scsyxcds1` int(11) comment '首次N+1月到期商业险出单',
	`newsyxcds2` int(11) comment '新转续N+2月到期商业险出单',
	`renewsyxcds2` int(11) comment '续转续N+2月到期商业险出单',
	`jzxsyxcds2` int(11) comment '间转续N+2月到期商业险出单',
	`qzxsyxcds2` int(11) comment '潜转续N+2月到期商业险出单',
	`scsyxcds2` int(11) comment '首次N+2月到期商业险出单',
	`newsyxcds3` int(11) comment '新转续N+3月到期商业险出单',
	`renewsyxcds3` int(11) comment '续转续N+3月到期商业险出单',
	`jzxsyxcds3` int(11) comment '间转续N+3月到期商业险出单',
	`qzxsyxcds3` int(11) comment '潜转续N+3月到期商业险出单',
	`scsyxcds3` int(11) comment '首次N+3月到期商业险出单',
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_day_kpi_cover_type` ADD INDEX report_day_kpi_cover_type_storeId_index( `storeId` );

/*
* 2017-03-13 新增更新密码记录表,bf_bip_update_password_record
*/
drop table if exists `bf_bip_update_password_record`;
CREATE TABLE `bf_bip_update_password_record` (
	`id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店Id',
	`billNumber` VARCHAR(40) comment '当日保单号',
	`userName` VARCHAR(40) comment '用户名',
	`password` VARCHAR(40) comment '密码',
	`insuranceCompName` VARCHAR(40) comment '保险公司名称',
	`operator` VARCHAR(40) COMMENT '操作人',
	`operateTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
	`operateStatu` int(3) DEFAULT 0 COMMENT '操作状态',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_update_password_record` ADD INDEX update_password_record_storeId_index( `storeId` );




/*
*2017-03-15操作记录表添加索引
*/
ALTER TABLE `bf_bip_operation_record` ADD INDEX customerId_index( `customerId` );

/*
* 2017-03-15 添加索引,odps同步使用
*/
ALTER TABLE `bf_bip_customer_assign` ADD INDEX customer_assign_id_index( `id` );
ALTER TABLE `bf_bip_operation_record` ADD INDEX operation_record_id_index( `id` );
ALTER TABLE `bf_bip_operation_record` ADD INDEX operation_record_operationFlag_index( `operationFlag` );
ALTER TABLE `bf_bip_renewaling_customer` ADD INDEX renewaling_customer_id_index( `id` );
ALTER TABLE `bf_bip_insurance_bill` ADD INDEX insurance_bill_insuranceBillId_index( `insuranceBillId` );

/*
* 2017-03-21 新增4个KPI月报表,bf_bip_report_month_kpi_bill_count(分保险公司),bf_bip_report_month_kpi_cdy(分出单员),
* bf_bip_report_month_kpi_xbzy_detail(续保专员详情),bf_bip_report_month_kpi_xbzy(分续保专员)
*/
drop table if exists `bf_bip_report_month_kpi_bill_count`;
CREATE TABLE `bf_bip_report_month_kpi_bill_count` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `storeId` int(11) DEFAULT NULL COMMENT '4s店Id',
  `storeName` varchar(40) DEFAULT NULL COMMENT '4s店名称',
  `insuranceCompId` int(11) DEFAULT NULL COMMENT '保险公司id',
  `insuranceCompName` varchar(40) DEFAULT NULL COMMENT '保险公司名称',
  `jqxNewBillCountQk` int(11) DEFAULT NULL COMMENT '新保全款交强险出单数',
  `syxNewBillCountQk` int(11) DEFAULT NULL COMMENT '新保全款商业险出单数',
  `sumNewBillCountQk` int(11) DEFAULT NULL COMMENT '新保全款出单数合计',
  `jqxNewBillCountDk` int(11) DEFAULT NULL COMMENT '新保贷款交强险出单数',
  `syxNewBillCountDk` int(11) DEFAULT NULL COMMENT '新保贷款商业险出单数',
  `sumNewBillCountDk` int(11) DEFAULT NULL COMMENT '新保贷款出单数合计',
  `jqxRenewalBillCount` int(11) DEFAULT NULL COMMENT '续保交强险出单数',
  `syxRenewalBillCount` int(11) DEFAULT NULL COMMENT '续保商业险出单数',
  `sumRenewalBillCount` int(11) DEFAULT NULL COMMENT '续保出单数合计',

  `jqxNewBillPremiumQk` double(16,2) DEFAULT NULL COMMENT '新保全款交强险保费',
  `syxNewBillPremiumQk` double(16,2) DEFAULT NULL COMMENT '新保全款商业险保费',
  `sumNewBillPremiumQk` double(16,2) DEFAULT NULL COMMENT '新保全款保费合计',
  `jqxNewBillPremiumDk` double(16,2) DEFAULT NULL COMMENT '新保贷款交强险保费',
  `syxNewBillPremiumDk` double(16,2) DEFAULT NULL COMMENT '新保贷款商业险保费',
  `sumNewBillPremiumDk` double(16,2) DEFAULT NULL COMMENT '新保贷款保费合计',
  `jqxRenewalBillPremium` double(16,2) DEFAULT NULL COMMENT '续保交强险保费',
  `syxRenewalBillPremium` double(16,2) DEFAULT NULL COMMENT '续保商业险保费',
  `sumRenewalBillPremium` double(16,2) DEFAULT NULL COMMENT '续保保费合计',

  `jqxNewBillHandlingRateQk` double(16,2) DEFAULT NULL COMMENT '新保全款交强险手续费率',
  `syxNewBillHandlingRateQk` double(16,2) DEFAULT NULL COMMENT '新保全款商业险手续费率',
  `jqxNewBillHandlingRateDk` double(16,2) DEFAULT NULL COMMENT '新保贷款交强险手续费率',
  `syxNewBillHandlingRateDk` double(16,2) DEFAULT NULL COMMENT '新保贷款商业险手续费率',
  `jqxRenewalBillHandlingRate` double(16,2) DEFAULT NULL COMMENT '续保交强险手续费率',
  `syxRenewalBillHandlingRate` double(16,2) DEFAULT NULL COMMENT '续保商业险手续费率',

  `jqxNewBillHandlingAmountQk` double(16,2) DEFAULT NULL COMMENT '新保全款交强险手续费金额',
  `syxNewBillHandlingAmountQk` double(16,2) DEFAULT NULL COMMENT '新保全款商业险手续费金额',
  `sumNewBillHandlingAmountQk` double(16,2) DEFAULT NULL COMMENT '新保全款手续费金额合计',
  `jqxNewBillHandlingAmountDk` double(16,2) DEFAULT NULL COMMENT '新保贷款交强险手续费金额',
  `syxNewBillHandlingAmountDk` double(16,2) DEFAULT NULL COMMENT '新保贷款商业险手续费金额',
  `sumNewBillHandlingAmountDk` double(16,2) DEFAULT NULL COMMENT '新保贷款手续费金额合计',
  `jqxRenewalBillHandlingAmount` double(16,2) DEFAULT NULL COMMENT '续保交强险手续费金额',
  `syxRenewalBillHandlingAmount` double(16,2) DEFAULT NULL COMMENT '续保商业险手续费金额',
  `sumRenewalBillHandlingAmount` double(16,2) DEFAULT NULL COMMENT '续保手续费金额合计',
  `recordTime` datetime DEFAULT NULL COMMENT '统计时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_month_kpi_bill_count` ADD INDEX month_kpi_bill_count_storeId_index( `storeId` );

drop table if exists `bf_bip_report_month_kpi_cdy`;
CREATE TABLE `bf_bip_report_month_kpi_cdy` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店Id',
	`storeName` VARCHAR(40) COMMENT '4s店名称',
	`userId` int(11) comment '用户id',
	`userName` VARCHAR(40) comment '用户名',
	`jdrs` int(11) comment '接待人数(实际到店人数)',
	`xbcs` int(11) comment '续保车数',
	`cds` int(11) comment '出单数',
	`ddcds` int(11) comment '到店出单数',
	`ddcdl` DOUBLE(16,2) comment '到店出单率',
	`syxcds` int(11) comment '商业险出单数(不含单三者)',
	`bfhj` DOUBLE(16,2) comment '保费合计(元)',
	`syxbfhj` DOUBLE(16,2) comment '商业险保费合计(不含单三者,元)',
	`syxdjbf` DOUBLE(16,2) comment '商业险单均保费(不含单三者,元)',
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_month_kpi_cdy` ADD INDEX report_month_kpi_cdy_storeId_index( `storeId` );

drop table if exists `bf_bip_report_month_kpi_xbzy_detail`;
CREATE TABLE `bf_bip_report_month_kpi_xbzy_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店Id',
	`userId` int(11) comment '用户id',
	`userName` VARCHAR(40) comment '用户名',
	`newgzrs` int(11) comment '新转续跟踪人数',
	`renewgzrs` int(11) comment '续转续跟踪人数',
	`jzxgzrs` int(11) comment '间转续跟踪人数',
	`qzxgzrs` int(11) comment '潜转续跟踪人数',
	`scgzrs` int(11) comment '首次跟踪人数',
	`newyyrs` int(11) comment '新转续邀约人数',
	`renewyyrs` int(11) comment '续转续邀约人数',
	`jzxyyrs` int(11) comment '间转续邀约人数',
	`qzxyyrs` int(11) comment '潜转续邀约人数',
	`scyyrs` int(11) comment '首次邀约人数',
	`newyyddrs` int(11) comment '新转续邀约到店人数',
	`renewyyddrs` int(11) comment '续转续邀约到店人数',
	`jzxyyddrs` int(11) comment '间转续邀约到店人数',
	`qzxyyddrs` int(11) comment '潜转续邀约到店人数',
	`scyyddrs` int(11) comment '首次邀约到店人数',
	`newxbcs` int(11) comment '新转续续保车数',
	`renewxbcs` int(11) comment '续转续续保车数',
	`jzxxbcs` int(11) comment '间转续续保车数',
	`qzxxbcs` int(11) comment '潜转续续保车数',
	`scxbcs` int(11) comment '首次续保车数',
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_month_kpi_xbzy_detail` ADD INDEX report_month_kpi_xbzy_detail_storeId_index( `storeId` );
ALTER TABLE `bf_bip_report_month_kpi_xbzy_detail` ADD INDEX report_month_kpi_xbzy_detail_userId_index( `userId` );

drop table if exists `bf_bip_report_month_kpi_xbzy`;
CREATE TABLE `bf_bip_report_month_kpi_xbzy` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店Id',
	`storeName` VARCHAR(40) COMMENT '4s店名称',
	`userId` int(11) comment '用户id',
	`userName` VARCHAR(40) comment '用户名',
	`traceCount` int(11) comment '跟踪人数',
	`zsgzcs` int(11) comment '准时跟踪次数',
	`needTraceCount` int(11) comment '应跟踪次数',
	`zsgjl` double(16,2) comment '准时跟进率',
	`inviteCount` int(11) comment '发起邀约人数',
	`yylInviteCount` int(11) COMMENT '邀约率邀约人数',
	`cyqks` int(11) comment '持有潜客数',
	`qkyyl` double(16,2) comment '潜客邀约率',
	`yjddrs` int(11) comment '预计到店人数',
	`comeStoreCount` int(11) comment '邀约到店人数',
	`yyddl` DOUBLE(16,2) COMMENT '邀约到店率',
	`xbcs` int(11) comment '续保车数',
	`syxcds` int(11) comment '商业险出单数(不含单三者)',
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_month_kpi_xbzy` ADD INDEX report_month_kpi_xbzy_storeId_index( `storeId` );

/*
* 2017-03-28
*/
ALTER TABLE bf_bip_customer ADD COLUMN updateStatus int(2) DEFAULT 0 COMMENT '壁虎自动更新标识,0表示未更新,1表示第二级别潜客已更新,2表示第三级别潜客已更新';
/*
* 2017-03-28
*/
drop table if exists `bf_bip_customer_update`;
CREATE TABLE `bf_bip_customer_update` (
	`id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店Id',
	`customerId` int(11) comment '潜客Id',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*
* 2017-03-28
*/
delete from bf_bip_module_setting where moduleName = 'update';

INSERT INTO bf_bip_module_setting (
	fourSStoreId,
	moduleName,
	switchOn
) SELECT
	storeId,
	'update',
	0
FROM
	bf_bip_store;

/*
*2017-03-28 自动获取壁虎保险续险信息的修改时间
*/
ALTER TABLE bf_bip_customer ADD COLUMN `bhUpdateTime` datetime DEFAULT null COMMENT '自动获取壁虎保险续险信息的修改时间';
ALTER TABLE bf_bip_renewaling_customer ADD COLUMN `bhUpdateTime` datetime DEFAULT null COMMENT '自动获取壁虎保险续险信息的修改时间';

/*
*2017-03-30 操作记录表操作标志字段的注释修改
*/
ALTER table bf_bip_operation_record MODIFY column operationFlag int(11) NOT NULL 
COMMENT '操作标志:1.延期,2.回退,3.激活,4.转入,5.转出,6.分配,7.将脱保,8.已脱保,9.跟踪,10.失销,11.睡眠,12.唤醒,13.生成潜客';

/*
* 	2017-04-06 新增6个KPI月报表,
*	bf_bip_report_month_kpi_cover_type_gzyy(分投保类型跟踪邀约),bf_bip_report_month_kpi_cover_type_ddcd(分投保类型到店出单),
*   bf_bip_report_month_kpi_cover_type_zhxb(分投保类型综合续保),bf_bip_report_month_kpi_cover_type_dqxb(分投保类型当期续保),
*   bf_bip_report_month_kpi_cover_type_resource(分投保类型资源),bf_bip_report_month_kpi_cover_type_xbwcl(分投保类型续保完成率)
*/
drop table if exists `bf_bip_report_month_kpi_cover_type_gzyy`;
CREATE TABLE `bf_bip_report_month_kpi_cover_type_gzyy` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店Id',
	`itemType` int(11) comment '项目类型,1表示跟踪人数,2表示邀约人数',
	`newN` int(11) comment '新转续N月到期',
	`renewN` int(11) comment '续转续N月到期',
	`jzxN` int(11) comment '间转续N月到期',
	`qzxN` int(11) comment '潜转续N月到期',
	`scN` int(11) comment '首次N月到期',
	`newN1` int(11) comment '新转续N+1月到期',
	`renewN1` int(11) comment '续转续N+1月到期',
	`jzxN1` int(11) comment '间转续N+1月到期',
	`qzxN1` int(11) comment '潜转续N+1月到期',
	`scN1` int(11) comment '首次N+1月到期',
	`newN2` int(11) comment '新转续N+2月到期',
	`renewN2` int(11) comment '续转续N+2月到期',
	`jzxN2` int(11) comment '间转续N+2月到期',
	`qzxN2` int(11) comment '潜转续N+2月到期',
	`scN2` int(11) comment '首次N+2月到期',
	`newN3` int(11) comment '新转续N+3月到期',
	`renewN3` int(11) comment '续转续N+3月到期',
	`jzxN3` int(11) comment '间转续N+3月到期',
	`qzxN3` int(11) comment '潜转续N+3月到期',
	`scN3` int(11) comment '首次N+3月到期',
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_month_kpi_cover_type_gzyy` ADD INDEX report_month_kpi_cover_type_gzyy_storeId_index( `storeId` );


drop table if exists `bf_bip_report_month_kpi_cover_type_ddcd`;
CREATE TABLE `bf_bip_report_month_kpi_cover_type_ddcd` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店Id',
	`itemType` int(11) comment '项目类型,1表示实际到店人数,2表示邀约到店人数,3表示本月出单数',
	`newN` int(11) comment '新转续N月到期',
	`renewN` int(11) comment '续转续N月到期',
	`jzxN` int(11) comment '间转续N月到期',
	`qzxN` int(11) comment '潜转续N月到期',
	`scN` int(11) comment '首次N月到期',
	`newN1` int(11) comment '新转续N+1月到期',
	`renewN1` int(11) comment '续转续N+1月到期',
	`jzxN1` int(11) comment '间转续N+1月到期',
	`qzxN1` int(11) comment '潜转续N+1月到期',
	`scN1` int(11) comment '首次N+1月到期',
	`newN2` int(11) comment '新转续N+2月到期',
	`renewN2` int(11) comment '续转续N+2月到期',
	`jzxN2` int(11) comment '间转续N+2月到期',
	`qzxN2` int(11) comment '潜转续N+2月到期',
	`scN2` int(11) comment '首次N+2月到期',
	`newN3` int(11) comment '新转续N+3月到期',
	`renewN3` int(11) comment '续转续N+3月到期',
	`jzxN3` int(11) comment '间转续N+3月到期',
	`qzxN3` int(11) comment '潜转续N+3月到期',
	`scN3` int(11) comment '首次N+3月到期',
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_month_kpi_cover_type_ddcd` ADD INDEX report_month_kpi_cover_type_ddcd_storeId_index( `storeId` );


drop table if exists `bf_bip_report_month_kpi_cover_type_zhxb`;
CREATE TABLE `bf_bip_report_month_kpi_cover_type_zhxb` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店Id',
	`newQntqcds` int(11) comment '新转续去年同期出单数',
	`renewQntqcds` int(11) comment '续转续去年同期出单数',
	`jzxQntqcds` int(11) comment '间转续去年同期出单数',
	`qzxQntqcds` int(11) comment '潜转续去年同期出单数',
	`scQntqcds` int(11) comment '首次去年同期出单数',
	`sumQntqcds` int(11) comment '去年同期出单数合计',
	`newBqzhxbl` double(16,2) comment '新转续本期综合续保率',
	`renewBqzhxbl` double(16,2) comment '续转续本期综合续保率',
	`jzxBqzhxbl` double(16,2) comment '间转续本期综合续保率',
	`qzxBqzhxbl` double(16,2) comment '潜转续本期综合续保率',
	`scBqzhxbl` double(16,2) comment '首次本期综合续保率',
	`sumBqzhxbl` double(16,2) comment '本期综合续保率合计',
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_month_kpi_cover_type_zhxb` ADD INDEX report_month_kpi_cover_type_zhxb_storeId_index( `storeId` );


drop table if exists `bf_bip_report_month_kpi_cover_type_dqxb`;
create table `bf_bip_report_month_kpi_cover_type_dqxb`(
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店id',
	`itemType` int(11) comment '项目类型,1表示当期续保数,2表示当期续保率',
	`newN` double(16,2) comment '新转续N月到期',
	`renewN` double(16,2) comment '续转续N月到期',
	`jzxN` double(16,2) comment '间转续N月到期',
	`qzxN` double(16,2) comment '潜转续N月到期',
	`scN` double(16,2) comment '首次N月到期',
	`sumN` double(16,2) comment '合计N月到期',
	`newN1` double(16,2) comment '新转续N+1月到期',
	`renewN1` double(16,2) comment '续转续N+1月到期',
	`jzxN1` double(16,2) comment '间转续N+1月到期',
	`qzxN1` double(16,2) comment '潜转续N+1月到期',
	`scN1` double(16,2) comment '首次N+1月到期',
	`sumN1` double(16,2) comment '合计N+1月到期',
	`newN2` double(16,2) comment '新转续N+2月到期',
	`renewN2` double(16,2) comment '续转续N+2月到期',
	`jzxN2` double(16,2) comment '间转续N+2月到期',
	`qzxN2` double(16,2) comment '潜转续N+2月到期',
	`scN2` double(16,2) comment '首次N+2月到期',
	`sumN2` double(16,2) comment '合计N+2月到期',
	`newN3` double(16,2) comment '新转续N+3月到期',
	`renewN3` double(16,2) comment '续转续N+3月到期',
	`jzxN3` double(16,2) comment '间转续N+3月到期',
	`qzxN3` double(16,2) comment '潜转续N+3月到期',
	`scN3` double(16,2) comment '首次N+3月到期',
	`sumN3` double(16,2) comment '合计N+3月到期',
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_month_kpi_cover_type_dqxb` ADD INDEX report_month_kpi_cover_type_dqxb_storeId_index( `storeId` );

drop table if exists `bf_bip_report_month_kpi_cover_type_resource`;
create table `bf_bip_report_month_kpi_cover_type_resource`(
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店id',
	`itemType` int(11) comment '项目类型,1表示全部潜客数,2表示往月提前出单,3表示往月失销数,4表示本月可出单',
	`newN` int(11) comment '新转续N月到期',
	`renewN` int(11) comment '续转续N月到期',
	`jzxN` int(11) comment '间转续N月到期',
	`qzxN` int(11) comment '潜转续N月到期',
	`scN` int(11) comment '首次N月到期',
	`newN1` int(11) comment '新转续N+1月到期',
	`renewN1` int(11) comment '续转续N+1月到期',
	`jzxN1` int(11) comment '间转续N+1月到期',
	`qzxN1` int(11) comment '潜转续N+1月到期',
	`scN1` int(11) comment '首次N+1月到期',
	`newN2` int(11) comment '新转续N+2月到期',
	`renewN2` int(11) comment '续转续N+2月到期',
	`jzxN2` int(11) comment '间转续N+2月到期',
	`qzxN2` int(11) comment '潜转续N+2月到期',
	`scN2` int(11) comment '首次N+2月到期',
	`newN3` int(11) comment '新转续N+3月到期',
	`renewN3` int(11) comment '续转续N+3月到期',
	`jzxN3` int(11) comment '间转续N+3月到期',
	`qzxN3` int(11) comment '潜转续N+3月到期',
	`scN3` int(11) comment '首次N+3月到期',
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_month_kpi_cover_type_resource` ADD INDEX report_month_kpi_cover_type_resource_storeId_index( `storeId` );

drop table if exists `bf_bip_report_month_kpi_cover_type_xbwcl`;
create table `bf_bip_report_month_kpi_cover_type_xbwcl`(
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店id',
	`newN` double(16,2) comment '新转续N月到期',
	`renewN` double(16,2) comment '续转续N月到期',
	`jzxN` double(16,2) comment '间转续N月到期',
	`qzxN` double(16,2) comment '潜转续N月到期',
	`scN` double(16,2) comment '首次N月到期',
	`sumN` double(16,2) comment 'N月到期合计',
	`newN1` double(16,2) comment '新转续N+1月到期',
	`renewN1` double(16,2) comment '续转续N+1月到期',
	`jzxN1` double(16,2) comment '间转续N+1月到期',
	`qzxN1` double(16,2) comment '潜转续N+1月到期',
	`scN1` double(16,2) comment '首次N+1月到期',
	`sumN1` double(16,2) comment 'N+1月到期合计',
	`newN2` double(16,2) comment '新转续N+2月到期',
	`renewN2` double(16,2) comment '续转续N+2月到期',
	`jzxN2` double(16,2) comment '间转续N+2月到期',
	`qzxN2` double(16,2) comment '潜转续N+2月到期',
	`scN2` double(16,2) comment '首次N+2月到期',
	`sumN2` double(16,2) comment 'N+2月到期合计',
	`newN3` double(16,2) comment '新转续N+3月到期',
	`renewN3` double(16,2) comment '续转续N+3月到期',
	`jzxN3` double(16,2) comment '间转续N+3月到期',
	`qzxN3` double(16,2) comment '潜转续N+3月到期',
	`scN3` double(16,2) comment '首次N+3月到期',
	`sumN3` double(16,2) comment 'N+3月到期合计',
	`newSum` double(16,2) comment '新转续合计',
	`renewSum` double(16,2) comment '续转续合计',
	`jzxSum` double(16,2) comment '间转续合计',
	`qzxSum` double(16,2) comment '潜转续合计',
	`scSum` double(16,2) comment '首次合计',
	`allSum` double(16,2) comment '全部的合计',
	`recordTime` datetime COMMENT '统计时间',
	PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_month_kpi_cover_type_xbwcl` ADD INDEX report_month_kpi_cover_type_xbwcl_storeId_index( `storeId` );

/*
*2017-04-12 销售战败潜客表(bf_bip_defeat_customer)和销售战败潜客关联表(bf_bip_defeat_customer_relate),添加和修改字段
*/
ALTER TABLE bf_bip_defeat_customer ADD COLUMN id int(11) NOT NULL AUTO_INCREMENT COMMENT 'id' PRIMARY KEY;
ALTER TABLE bf_bip_defeat_customer ADD COLUMN bip_storeId int(11) COMMENT 'bip的4s店ID';
ALTER TABLE bf_bip_defeat_customer ADD COLUMN createDate date COMMENT '创建时间';
ALTER TABLE bf_bip_defeat_customer ADD COLUMN bipImportData int(3) DEFAULT 0 COMMENT '是否为bip导入的数据';
ALTER TABLE bf_bip_defeat_customer MODIFY COLUMN bsp_storeId int(11) COMMENT 'bsp的4s店ID';
ALTER TABLE bf_bip_defeat_customer MODIFY COLUMN contactWay varchar(45) NOT NULL COMMENT '潜客电话';
ALTER TABLE bf_bip_defeat_customer ADD INDEX defeat_customer_bip_storeId( `bip_storeId` );

ALTER TABLE bf_bip_defeat_customer_relate ADD COLUMN id int(11) NOT NULL AUTO_INCREMENT COMMENT 'id' PRIMARY KEY;
ALTER TABLE bf_bip_defeat_customer_relate ADD COLUMN bip_storeId int(11) COMMENT 'bip的4s店ID';
ALTER TABLE bf_bip_defeat_customer_relate MODIFY COLUMN bsp_storeId int(11) COMMENT 'bsp的4s店ID';
ALTER TABLE bf_bip_defeat_customer_relate ADD INDEX defeat_customer_relate_bip_storeId( `bip_storeId` );

/*
*2017-04-17 建议添加字段
*/
ALTER TABLE bf_bip_suggest ADD COLUMN disContent VARCHAR (500) DEFAULT NULL COMMENT '客服的回复的处理结果';

/*
*2017-04-21 角色表添加一条前台主管的记录 
*  胡良清添加
*/
insert into bf_bip_role VALUES(19,'前台主管');


/*
*2017-04-28 角色表添加一条短信发送的记录 
*  胡良清添加
*/
insert into bf_bip_role VALUES(20,'短信发送');

/*
*2017-04-28 添加一个存放短信发送记录的表(bf_bip_send_phone_message) 
*  胡良清添加
*/
drop table if exists `bf_bip_send_phone_message`;
create table `bf_bip_send_phone_message`(
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) comment '4s店id',
	`userId` int(11) comment '用户id',
	`customerId` int(11) comment '潜客id',
	`contact` varchar(40) comment '联系人',
	`contactWay` varchar(40) comment '联系电话',
	`content` varchar(1000) comment '短信内容',
	`sendTime` datetime COMMENT '短信发送时间',
	PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_send_phone_message` ADD INDEX send_phone_message_storeId_index( `storeId` );
ALTER TABLE `bf_bip_send_phone_message` ADD INDEX send_phone_message_userId_index( `userId` );
/*
*2017-06-02 添加一个存放昵称的字段
*  陈润林添加
*/
ALTER TABLE `bf_bip_customer` ADD COLUMN nicheng VARCHAR (20) DEFAULT NULL COMMENT '昵称';
ALTER TABLE `bf_bip_renewaling_customer` ADD COLUMN nicheng VARCHAR (20) DEFAULT NULL COMMENT '昵称';

/*
*2017-06-14 添加一个存放app登录的uuid的字段
*  陈润林添加
*/
ALTER TABLE `bf_bip_user` ADD COLUMN loginAppUuId VARCHAR (50) DEFAULT NULL COMMENT 'app登录时生成的uuid';


/*
*2017-06-19 新增维修记录表(bf_bip_maintenance_record),维修配件表(bf_bip_maintenance_part),维修项目表(bf_bip_maintenance_item)
*  胡良清添加
*/
drop table if exists `bf_bip_maintenance_record`;
create table `bf_bip_maintenance_record`(
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) NOT NULL comment '4s店id',
	`maintainNumber` varchar(40) NOT NULL comment '施工单号',
	`reportNumber` varchar(40) comment '报案号',
  `maintenanceTimeStart` date NOT NULL COMMENT '维修开始时间',
	`maintenanceTimeEnd` date NOT NULL COMMENT '维修结束时间',
	`carLicenseNumber` varchar(40) NOT NULL comment '车牌号',
	`entrustor` varchar(40) comment '托修人',
	`entrustorPhone` varchar(40) comment '托修人联系方式',
	`maintenanceType` varchar(40) comment '维修种类',
	`certainCost` double(16,2) comment '定损金额(元)',
	`maintainCost` double(16,2) NOT NULL comment '维修金额(元)',
	`realCost` double(16,2) comment '实收金额(元)',
	`consultantId` int(11) comment '服务顾问id',
	`consultantName` varchar(40) comment '服务顾问名字',
	`createTime` datetime COMMENT '创建时间',
	PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_maintenance_record` ADD INDEX maintenance_record_storeId_index( `storeId` );
ALTER TABLE `bf_bip_maintenance_record` ADD INDEX maintenance_record_maintainNumber_index( `maintainNumber` );
ALTER TABLE `bf_bip_maintenance_record` ADD INDEX maintenance_record_carLicenseNumber_index( `carLicenseNumber` );
ALTER TABLE `bf_bip_maintenance_record` ADD UNIQUE maintenance_record_maintainNumber_storeId_index( `maintainNumber`, `storeId`); 
ALTER TABLE `bf_bip_maintenance_record` ADD UNIQUE maintenance_record_reportNumber_storeId_index( `reportNumber`, `storeId`); 


drop table if exists `bf_bip_maintenance_part`;
create table `bf_bip_maintenance_part`(
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) NOT NULL comment '4s店id',
	`maintainNumber` varchar(40) NOT NULL comment '施工单号',
	`partName` varchar(40) NOT NULL comment '配件名称',
	`unit` varchar(40) comment '单位',
	`amount` int(11) comment '数量',
	`unitPrice` double(16,2) comment '单价(元)',
  `totalAmount` double(16,2) comment '总金额',
	`remark` varchar(500) comment '备注',
	`createTime` datetime COMMENT '创建时间',
	PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_maintenance_part` ADD INDEX maintenance_part_storeId_index( `storeId` );
ALTER TABLE `bf_bip_maintenance_part` ADD INDEX maintenance_part_maintainNumber_index( `maintainNumber` );

drop table if exists `bf_bip_maintenance_item`;
create table `bf_bip_maintenance_item`(
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) NOT NULL comment '4s店id',
	`maintainNumber` varchar(40) NOT NULL comment '施工单号',
	`maintenanceItem` varchar(40) NOT NULL comment '维修项目',
	`workingHour` int(11) comment '工时',
	`workingCost` double(16,2) comment '工时费用(元)',
	`remark` varchar(500) comment '备注',
	`createTime` datetime COMMENT '创建时间',
	PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_maintenance_item` ADD INDEX maintenance_item_storeId_index( `storeId` );
ALTER TABLE `bf_bip_maintenance_item` ADD INDEX maintenance_item_maintainNumber_index( `maintainNumber` );

/*
*2017-06-20 新增推送修记录表(bf_bip_push_maintenance),推送修记录子表(bf_bip_push_maintenance_child)
*  胡良清添加
*/
drop table if exists `bf_bip_push_maintenance`;
create table `bf_bip_push_maintenance`(
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) NOT NULL comment '4s店id',
	`reportNumber` varchar(40) NOT NULL comment '报案号',
	`pushTime` date COMMENT '推送时间',
	`insuranceNumber` varchar(40) NOT NULL comment '保单号',
	`carLicenseNumber` varchar(40) NOT NULL DEFAULT '' comment '车牌号',
	`chassisNumber` varchar(40) NOT NULL comment '车架号',
	`insuranceComp` varchar(40) NOT NULL comment '保险公司',
	`reporter` varchar(40) NOT NULL comment '报案人',
	`reporterPhone` varchar(40) NOT NULL comment '报案电话',
	`reportTime` date comment '报案时间',
	`accidentPlace` varchar(40) NOT NULL comment '出险地点',
	`accidentTime` date NOT NULL COMMENT '出险时间',
	`accidentReason` varchar(40) COMMENT '出险原因',
	`agencyName` varchar(40) comment '机构名称',
	`agencyCode` varchar(40) comment '机构代码',
	`channelSource` varchar(40) comment '保单渠道来源',
	`groupType` varchar(40) comment '个团类型',
	`clerk` varchar(40) comment '业务员',
	`customerFlag` varchar(40) comment '客户标识',
	`insuranceDateStart` date comment '保险起期',
	`insuranceDateEnd` date comment '保险止期',
	`driveArea` varchar(40) comment '行驶区域',	
	`csxbe` double(16,2) comment '车损险保额',
	`syszxbe` double(16,2) comment '商业三者险保额',
	`lasj` date comment '立案时间',
	`laje` double(16,2) comment '立案金额',
	`cslaje` double(16,2) comment '车损立案金额',
	`rslaje` double(16,2) comment '人伤立案金额',
	`wslaje` double(16,2) comment '物损立案金额',
	`jasj` date comment '结案时间',
	`jaje` double(16,2) comment '结案金额',
	`csjaje` double(16,2) comment '车损结案金额',
	`rsjaje` double(16,2) comment '人伤结案金额',
	`wsjaje` double(16,2) comment '物损结案金额',
	`zaje` double(16,2) comment '整案金额',
	`bajsy` varchar(40) comment '报案驾驶员',
	`cxjsy` varchar(40) comment '出险驾驶员',
	`sfhk` int(3) default 0 comment '是否回款',
	`sfxcba` int(3) default 0 comment '是否现场报案',
	`sfmxc` int(3) default 0 comment '是否免现场',
	`sslx` varchar(40) comment '损失类型',
	`baclyj` varchar(40) comment '报案处理意见',
	`sglx` varchar(40) comment '事故类型',
	`zrxs` int(11) comment '责任系数',
	`ajtd` varchar(40) COMMENT '案件通道',
	`ajzt` varchar(40) comment '案件状态',
	`wjzt` varchar(40) comment '未决状态',
	`wjje` double(16,2) comment '未决金额',
	`pfcs` int(3) comment '赔付次数',
	`pfjl` varchar(40) comment '赔付结论',
	`baly` varchar(40) comment '报案来源',
	`createTime` datetime COMMENT '创建时间',
	PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_push_maintenance` ADD INDEX push_maintenance_storeId_index( `storeId` );
ALTER TABLE `bf_bip_push_maintenance` ADD INDEX push_maintenance_reportNumber_index( `reportNumber` );
ALTER TABLE `bf_bip_push_maintenance` ADD INDEX push_maintenance_carLicenseNumber_index( `carLicenseNumber` );
ALTER TABLE `bf_bip_push_maintenance` ADD INDEX push_maintenance_insuranceComp_index( `insuranceComp` );
ALTER TABLE `bf_bip_push_maintenance` ADD INDEX push_maintenance_chassisNumber_index( `chassisNumber` );
ALTER TABLE `bf_bip_push_maintenance` ADD UNIQUE push_maintenance_reportNumber_storeId_index( `reportNumber`, `storeId`); 

drop table if exists `bf_bip_push_maintenance_child`;
create table `bf_bip_push_maintenance_child`(
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) NOT NULL comment '4s店id',
	`reportNumber` varchar(40) NOT NULL comment '报案号',
	`ppcx` varchar(40) comment '品牌车型',
	`engineNumber` varchar(40) comment '发动机号',
	`insured` varchar(40) comment '被保险人',
	`clzws` int(3) comment '车辆座位数',
	`sfnzcxs` int(3) default 0 comment '是否能正常行驶',
	`cwckr` varchar(40) comment '车物查勘人',
	`rsdhcky` varchar(40) comment '人伤电话查勘员',
	`rssdcky` varchar(40) comment '人伤实地查勘员',
	`sfdhck` int(3) default 0 comment '是否电话查勘',
 	`zfdxsfbbxr` int(3) default 0 comment '支付对象是否被保险人',
	`sczfcgTime` date COMMENT '首次支付成功时间',
	`mczfcgTime` date COMMENT '末次支付成功时间',
	`sczfthTime` date COMMENT '首次支付退回时间',
	`sfczjth` int(3) default 0 comment '是否曾质检退回', 		 				
	`dachr` varchar(40) comment '大案初核人',
	`dachsj` date comment '大案初核时间',
	`sfrskckp` int(3) default 0 comment '是否人伤快处快赔',
	`sdsj` date comment '收单时间',
	`sdr` varchar(40) comment '收单人',
	`sfrgls1` int(3) default 0 comment '是否人工理算(符合人工理算规则)',
	`sfrgls2` int(3) default 0 comment '是否人工理算(经过人工理算平台)',
	`zalsTimeStart` date comment '整案理算开始时间',
	`zalsTimeEnd` date comment '整案理算结束时间',
	`scrgzjTimeStart` date comment '首次人工质检开始时间',
	`mcrgzjTimeEnd` date comment '末次人工质检结束时间',
	`scckTimeStart` date comment '首次查勘开始时间',
	`mcckTimeEnd` date comment '末次查勘结束时间',
	`sctdTime` date comment '首次提调时间',
	`sfzdtd` int(3) default 0 comment '是否自动提调',
	`sftd` int(3) default 0 comment '是否提调',
	`dssfbhsjf` int(3) default 0 comment '定损是否包含施救费',
	`sfxxycsjqq` int(3) default 0 comment '是否信息一次收集齐全',
	`ckwtsljg` varchar(40) comment '查勘委托受理机构',
	`cwnbdcjsje` double(16,2) comment '车物内部调查减损金额',
	`cwwbdcjsje` double(16,2) comment '车物外部调查减损金额',
	`jpje` double(16,2) comment '拒赔金额',
	`fkjsje` double(16,2) comment '复勘减损金额',		 			  	
	`zcje` double(16,2) comment '追偿金额',	
	`sfdlsp` int(3) default 0 comment '是否代理索赔',	
	`dlspxlcmc` varchar(40) comment '代理索赔修理厂名称',	
	`sfss` int(3) default 0 comment '是否诉讼',	
	`yeqxfsckrwls` int(11) comment '有E权限发送查勘任务流数',	
	`yeqxfsdsrwls` int(11) comment '有E权限发送定损任务流数',	
	`elpfsdsrwls` int(11) comment 'E理赔发送定损任务流数',	
	`elpfsckrwls` int(11) comment 'E理赔发送查勘任务流数',	
	`fscsdsrwls` int(11) comment '发送车损定损任务流数',		
	`createTime` datetime COMMENT '创建时间',
	PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_push_maintenance_child` ADD INDEX push_maintenance_child_storeId_index( `storeId` );
ALTER TABLE `bf_bip_push_maintenance_child` ADD INDEX push_maintenance_child_reportNumber_index( `reportNumber` );
ALTER TABLE `bf_bip_push_maintenance_child` ADD UNIQUE push_maintenance_child_reportNumber_storeId_index( `reportNumber`, `storeId`);


/*
*2017-06-23 bf_bip_insurance_bill对 4s店id字段添加索引
*  胡良清添加
*/
ALTER TABLE `bf_bip_insurance_bill` ADD INDEX insurance_bill_fourSStoreId_index( `fourSStoreId` );

/*
*2017-06-27 存放保险公司业务占比报表的数据
*  陈润林添加
*/
DROP TABLE IF EXISTS bf_bip_report_day_insurance;

CREATE TABLE bf_bip_report_day_insurance (
  id int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  xId int(11) DEFAULT NULL COMMENT 'x轴id',
  xName varchar(30) DEFAULT NULL COMMENT 'x轴名称',
  yId int(11) DEFAULT NULL COMMENT 'y轴id',
  yName varchar(30) DEFAULT NULL COMMENT 'y轴名称',
  stack int(5) DEFAULT NULL COMMENT '区域',
  stackName varchar(30) DEFAULT NULL COMMENT '区域名字',
  countValues int(11) DEFAULT 0 COMMENT '统计值',
  recordTime date DEFAULT NULL COMMENT '记录时间',
  storeId int(10) NOT NULL COMMENT '店的id',
  PRIMARY KEY (id)

)ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_day_insurance` ADD INDEX report_day_insurance_storeId_index( `storeId` );

/*
*2017-06-28 营销短信发送模板表
*  陈润林添加
*/
DROP TABLE IF EXISTS bf_bip_sms_template;

CREATE TABLE bf_bip_sms_template (
  id int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  storeId int(11) NOT NULL COMMENT '店的id',
  templateName varchar(50) NOT NULL COMMENT '模板名称',
  details varchar(500) NOT NULL COMMENT '活动详情',
  startTime dateTime NOT NULL COMMENT '活动开始时间',
  endTime dateTime NOT NULL COMMENT '活动结束时间',
  establishName varchar(30) DEFAULT NULL COMMENT '创建人',
  establishTime dateTime DEFAULT NULL COMMENT '创建时间',
  enabledState int(2) DEFAULT 0 COMMENT '启用状态',
  endOperationName varchar(30) DEFAULT NULL COMMENT '最后操作人',
  endOperationTime dateTime DEFAULT NULL COMMENT '最后操作时间',
  deleted int(3) default 0 comment '是否删除',
  PRIMARY KEY (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_sms_template` ADD INDEX sms_template_storeId_index( `storeId` );

/*
* 2017-07-04 哪些潜客需要发送营销短信表
*  陈润林添加
*/
DROP TABLE IF EXISTS `bf_bip_customer_update_sms`;
CREATE TABLE `bf_bip_customer_update_sms` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `storeId` int(11) NOT NULL COMMENT '4s店Id',
  `customerId` int(11) NOT NULL COMMENT '潜客Id',
  `recordTime` dateTime NOT NULL COMMENT '记录时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2276 DEFAULT CHARSET=utf8;

/*
* 2017-07-04 给短信表增加一个区别手动和定时发送短信的字段
*	陈润林添加
*/
ALTER TABLE `bf_bip_send_phone_message` ADD COLUMN `type` int (2) DEFAULT 0 COMMENT '区别手动和定时发送短信,0为手动，1为定时';

/*
* 2017-07-04 给模块设置增加一个营销短信发送的配置
*	陈润林添加
*/
INSERT INTO bf_bip_module_setting (
	fourSStoreId,
	moduleName,
	switchOn
) SELECT
	storeId,
	'updateSMS',
	0
FROM
	bf_bip_store;

/*
* 2017-07-05 给短信表增加一个营销短信发送模板表ID
*	陈润林添加
*/
ALTER TABLE `bf_bip_send_phone_message` ADD COLUMN `smsTemplateId` int (11) DEFAULT NULL COMMENT '营销短信发送模板表ID';

/*
* 2017-07-07 给短信表增加一个区别有没有点击感兴趣的字段和添加一个索引
*	陈润林添加
*/
ALTER TABLE `bf_bip_send_phone_message` ADD COLUMN `sfdj` int (2) DEFAULT 0 COMMENT '0表示点击感兴趣，1表示已经点击';
ALTER TABLE `bf_bip_send_phone_message` ADD INDEX send_phone_message_customerId_index( `customerId` );

/*
* 2017-07-20 操作记录表(bf_bip_operation_record)添加一个字段,表示分配来源
*	胡良清添加
*/
ALTER TABLE `bf_bip_operation_record` ADD COLUMN `assignSource` int (3) DEFAULT 0 COMMENT '分配来源,1:销售顾问跟踪完成分配,2:服务顾问跟踪完成分配,3:经理转入';

/*
* 2017-07-20 新增客户流转趋势表(bf_bip_report_month_customer_trend),客户流转趋势明细表(bf_bip_report_month_customer_trend_detail)
*	胡良清添加
*/
DROP TABLE IF EXISTS `bf_bip_report_month_customer_trend`;

CREATE TABLE `bf_bip_report_month_customer_trend` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `storeId` int(11) DEFAULT NULL COMMENT '4s店Id',
  `xId` int(11) DEFAULT NULL COMMENT '横坐标id',
  `xName` varchar(40) DEFAULT NULL COMMENT '横坐标名称',
  `yId` int(11) DEFAULT NULL COMMENT '纵坐标id',
  `yName` varchar(40) DEFAULT NULL COMMENT '纵坐标名称',
  `countValues` int(11) DEFAULT NULL COMMENT '统计值',
  `stack` int(11) DEFAULT NULL,
  `stackName` varchar(20) DEFAULT NULL,
  `recordTime` datetime DEFAULT NULL COMMENT '统计时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_month_customer_trend` ADD INDEX customer_trend_storeId_index( `storeId` );
ALTER TABLE `bf_bip_report_month_customer_trend` ADD INDEX customer_trend_id_index( `id` );

DROP TABLE IF EXISTS `bf_bip_report_month_customer_trend_detail`;
CREATE TABLE `bf_bip_report_month_customer_trend_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `storeId` int(11) NOT NULL COMMENT '4s店Id',
	`userId` int(11) NOT NULL COMMENT '用户Id',
	`stackName` varchar(40) NOT NULL COMMENT '柱子名称',
  `holderName` varchar(40) DEFAULT NULL COMMENT '持有人',
  `customerLevel` varchar(40) DEFAULT NULL COMMENT '客户级别',
	`carLicenseNumber` varchar(40) DEFAULT NULL COMMENT '车牌号',
	`chassisNumber` varchar(40) DEFAULT NULL COMMENT '车架号',
  `engineNumber` varchar(40) DEFAULT NULL COMMENT '发动机号',
  `renewalType` varchar(40) DEFAULT NULL COMMENT '投保类型',
  `jqxrqEnd` date DEFAULT NULL COMMENT '交强险到期日',
  `syxrqEnd` date DEFAULT NULL COMMENT '商业险到期日',
  `recordTime` date DEFAULT NULL COMMENT '统计时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_month_customer_trend_detail` ADD INDEX customer_trend_detail_storeId_index( `storeId` );
ALTER TABLE `bf_bip_report_month_customer_trend_detail` ADD INDEX customer_trend_detail_stackName_index( `stackName` );
ALTER TABLE `bf_bip_report_month_customer_trend_detail` ADD INDEX customer_trend_detail_recordTime_index( `recordTime` );


/*
* 2017-07-20 操作潜客表小池子(bf_bip_renewaling_customer)添加一个字段,表示建档人id
*	胡良清添加
*/
ALTER TABLE `bf_bip_renewaling_customer` ADD COLUMN `createrId` int(11) DEFAULT NULL COMMENT '建档人id';


/*
*2017-07-27 角色表添加一条信息员的记录 
*  胡良清添加
*/
insert into bf_bip_role VALUES(21,'信息员');

/*
* 2017-07-28 赠品表(bf_bip_gift_management),礼包明细表(bf_bip_gift_package_detail)
*	胡良清添加
*/
DROP TABLE IF EXISTS `bf_bip_gift_management`;
CREATE TABLE `bf_bip_gift_management` (
	`id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`storeId` int(11) NOT NULL COMMENT '4s店Id',
	`giftCode` varchar(40) NOT NULL COMMENT '赠品编码',
	`giftName` varchar(40) NOT NULL COMMENT '赠品名称',
	`giftModel` varchar(40) DEFAULT NULL COMMENT '赠品型号',
	`giftType` int(3) NOT NULL COMMENT '赠品类型,1:服务类;2.精品类;3.礼包类',
	`guidePrice` double(16,2) DEFAULT 0 COMMENT '指导价',
	`salePrice` double(16,2) DEFAULT 0 COMMENT '销售成本',
	`actualPrice` double(16,2) DEFAULT 0 COMMENT '实际成本',  
	`packageGuidePrice` double(16,2) DEFAULT 0 COMMENT '礼包指导价',
	`packageSalePrice` double(16,2) DEFAULT 0 COMMENT '礼包销售成本',
	`packageActualPrice` double(16,2) DEFAULT 0 COMMENT '礼包实际成本',  
	`validLength` int(11) DEFAULT 0 COMMENT '有效时限',
	`effectiveTime` date DEFAULT NULL COMMENT '生效时间',
	`failureTime` date DEFAULT NULL COMMENT '失效时间',
	`status` int(3) DEFAULT 0 COMMENT '状态,1,生效中;2.未生效',
	`remark` varchar(500) DEFAULT NULL COMMENT '备注',
	`createTime` date DEFAULT NULL COMMENT '创建时间',
	`updateTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_gift_management` ADD INDEX gift_management_storeId_index( `storeId` );
ALTER TABLE `bf_bip_gift_management` ADD INDEX gift_management_giftCode_index( `giftCode` );
ALTER TABLE `bf_bip_gift_management` ADD INDEX gift_management_giftName_index( `giftName` );
ALTER TABLE `bf_bip_gift_management` ADD INDEX gift_management_giftType_index( `giftType` );
ALTER TABLE `bf_bip_gift_management` ADD INDEX gift_management_status_index( `status` );


DROP TABLE IF EXISTS `bf_bip_gift_package_detail`;
CREATE TABLE `bf_bip_gift_package_detail` (
	`id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
	`packageId` int(11) NOT NULL COMMENT '礼包Id',
	`giftCode` varchar(40) NOT NULL COMMENT '赠品编码',
	`giftName` varchar(40) NOT NULL COMMENT '赠品名称',
	`giftType` int(3) NOT NULL COMMENT '赠品类型,1:服务类;2.精品类', 
	`guidePrice` double(16,2) DEFAULT 0 COMMENT '指导价',
	`salePrice` double(16,2) DEFAULT 0 COMMENT '销售成本',
	`actualPrice` double(16,2) DEFAULT 0 COMMENT '实际成本', 
	`number` int(11) DEFAULT 0 COMMENT '数量',
	`createTime` date DEFAULT NULL COMMENT '创建时间',
	`updateTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_gift_package_detail` ADD INDEX gift_package_detail_packageId_index( `packageId` );


/*
*2017-07-31 角色表添加一条总经理助理的记录 
*  胡良清添加
*/
insert into bf_bip_role VALUES(22,'总经理助理');

/*
*2017-08-02 保单表添加一个赠送优惠字段
*  陈润林添加
*/
ALTER TABLE `bf_bip_insurance_bill` ADD COLUMN `giftDiscount` double(10,2) DEFAULT NULL COMMENT '赠送优惠';

/*
* 2017-08-03 给模块设置增加一个台帐模块的配置
*	胡良清添加
*/
INSERT INTO bf_bip_module_setting (fourSStoreId,moduleName,switchOn) 
SELECT	storeId,'accountModule',0 FROM bf_bip_store;

/*
* 2017-08-03 给审批单记录表添加两个字段,表示赠送优惠和综合优惠
*	胡良清添加
*/
ALTER TABLE `bf_bip_approval_bill` ADD COLUMN `giftDiscount` double(16,2) DEFAULT 0 COMMENT '赠送优惠';
ALTER TABLE `bf_bip_approval_bill` ADD COLUMN `comprehensiveDiscount` double(16,2) DEFAULT 0 COMMENT '综合优惠';

ALTER TABLE `bf_bip_approval_bill_record` ADD COLUMN `giftDiscount` double(16,2) DEFAULT 0 COMMENT '赠送优惠';
ALTER TABLE `bf_bip_approval_bill_record` ADD COLUMN `comprehensiveDiscount` double(16,2) DEFAULT 0 COMMENT '综合优惠';

/*
* 2017-08-03 添加一个审批单赠送信息记录表(bf_bip_giving_information_record), bf_bip_giving_information添加相应字段
*	胡良清添加
*/
DROP TABLE IF EXISTS `bf_bip_giving_information_record`;

CREATE TABLE `bf_bip_giving_information_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '赠送信息自增id',
  `approvalBillId` int(11) NOT NULL COMMENT '审批单id',
	`zsxx` varchar(200) DEFAULT NULL COMMENT '赠送信息',
  `giftCode` varchar(40) DEFAULT NULL COMMENT '赠品编码',
	`giftName` varchar(40) DEFAULT NULL COMMENT '赠品名称',
	`giftType` int(3) DEFAULT NULL COMMENT '赠品类型,1:服务类;2.精品类;3.礼包类',
	`validDate` Date DEFAULT NULL COMMENT '有效期至',
	`guidePrice` double(16,2) DEFAULT 0 COMMENT '指导价',
  `salePrice` double(16,2) DEFAULT 0 COMMENT '销售成本',
	`actualPrice` double(16,2) DEFAULT 0 COMMENT '实际成本', 
	`discount` double(16,2) DEFAULT 0 COMMENT '折扣',
	`sellingPrice` double(16,2) DEFAULT NULL COMMENT '销售价',
	`amount` int(11) DEFAULT 0 COMMENT '数量',
	`amountMoney` double(16,2) DEFAULT NULL COMMENT '总金额',
	`remark` varchar(500) DEFAULT NULL COMMENT '备注',
	`createTime` date DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_giving_information_record` ADD INDEX giving_information_record_approvalBillId_index( `approvalBillId` );
ALTER TABLE `bf_bip_giving_information_record` ADD INDEX giving_information_record_giftCode_index( `giftCode` );
ALTER TABLE `bf_bip_giving_information_record` ADD INDEX giving_information_record_giftName_index( `giftName` );
ALTER TABLE `bf_bip_giving_information_record` ADD INDEX giving_information_record_giftType_index( `giftType` );


ALTER TABLE `bf_bip_giving_information` ADD COLUMN `giftCode` varchar(40) DEFAULT NULL COMMENT '赠品编码';
ALTER TABLE `bf_bip_giving_information` ADD COLUMN `giftName` varchar(40) DEFAULT NULL COMMENT '赠品名称';
ALTER TABLE `bf_bip_giving_information` ADD COLUMN `giftType` int(3) DEFAULT NULL COMMENT '赠品类型,1:服务类;2.精品类;3.礼包类';
ALTER TABLE `bf_bip_giving_information` ADD COLUMN `validDate` Date DEFAULT NULL COMMENT '有效期至';
ALTER TABLE `bf_bip_giving_information` ADD COLUMN `guidePrice` double(16,2) DEFAULT 0 COMMENT '指导价';
ALTER TABLE `bf_bip_giving_information` ADD COLUMN `salePrice` double(16,2) DEFAULT 0 COMMENT '销售成本';
ALTER TABLE `bf_bip_giving_information` ADD COLUMN `actualPrice` double(16,2) DEFAULT 0 COMMENT '实际成本'; 
ALTER TABLE `bf_bip_giving_information` ADD COLUMN `discount` double(16,2) DEFAULT 0 COMMENT '折扣';
ALTER TABLE `bf_bip_giving_information` ADD COLUMN `sellingPrice` double(16,2) DEFAULT NULL COMMENT '销售价';
ALTER TABLE `bf_bip_giving_information` ADD COLUMN `amount` int(11) DEFAULT 0 COMMENT '数量';
ALTER TABLE `bf_bip_giving_information` ADD COLUMN `amountMoney` double(16,2) DEFAULT NULL COMMENT '总金额';
ALTER TABLE `bf_bip_giving_information` ADD COLUMN `remark` varchar(500) DEFAULT NULL COMMENT '备注';
ALTER TABLE `bf_bip_giving_information` ADD COLUMN `createTime` date DEFAULT NULL COMMENT '创建时间';

/*
*	2017-08-09 给bf_bip_insurance_bill表的approvalBillId字段加一个索引
* 	陈润林
*/
ALTER TABLE `bf_bip_insurance_bill` ADD INDEX insurance_bill_approvalBillId_index( `approvalBillId` );
ALTER TABLE `bf_bip_giving_information_record` ADD COLUMN `surplusNum` int(5) DEFAULT 0 COMMENT '剩余数量';
ALTER TABLE `bf_bip_giving_information_record` ADD COLUMN `thisUseNum` int(5) DEFAULT 0 COMMENT '本次使用数量';
/*
*	2017-08-11 给bf_bip_insurance_bill表的approvalBillId字段加一个索引
* 	陈润林
*/
ALTER TABLE `bf_bip_giving_information_record` ADD COLUMN `givingInformationId` int(11) NOT NULL DEFAULT 0 COMMENT '礼包类的赠送记录的ID,如果为0则表示不属于礼包,如果不为0则属于此ID的礼包类';


/*
*	2017-08-24 修改同步保险公司密码记录表(bf_bip_update_password_record)设计
* 	胡良清
*/
ALTER TABLE `bf_bip_update_password_record` DROP COLUMN `billNumber`;
ALTER TABLE `bf_bip_update_password_record` DROP COLUMN `password`;
ALTER TABLE `bf_bip_update_password_record` ADD COLUMN `oldPassword` varchar(40) DEFAULT NULL COMMENT '旧密码';
ALTER TABLE `bf_bip_update_password_record` ADD COLUMN `newPassword` varchar(40) DEFAULT NULL COMMENT '新密码';

/*
*   2017-09-05 改用户表新增5个字段，用来标识平均分配
*   陈润林
*/
ALTER TABLE `bf_bip_user` ADD COLUMN `xinzhuanxu` int(3) DEFAULT 0 COMMENT '本用户新转续已经多分配的潜客数量';
ALTER TABLE `bf_bip_user` ADD COLUMN `xuzhuanxu` int(3) DEFAULT 0 COMMENT '本用户续转续已经多分配的潜客数量';
ALTER TABLE `bf_bip_user` ADD COLUMN `jianzhuanxu` int(3) DEFAULT 0 COMMENT '本用户间转续已经多分配的潜客数量';
ALTER TABLE `bf_bip_user` ADD COLUMN `qianzhuanxu` int(3) DEFAULT 0 COMMENT '本用户潜转续已经多分配的潜客数量';
ALTER TABLE `bf_bip_user` ADD COLUMN `shouci` int(3) DEFAULT 0 COMMENT '本用户首次已经多分配的潜客数量';

/*
*   2017-09-06 新增一个分配潜客的模块
*   陈润林
*/
INSERT INTO bf_bip_module_setting (
	fourSStoreId,
	moduleName,
	switchOn
) SELECT
	storeId,
	'distribution',
	0
FROM
	bf_bip_store;
	
/*
*   2017-09-12 给店新增两个字段
*   陈润林
*/
ALTER TABLE `bf_bip_store` ADD COLUMN `shopId` varchar(100) DEFAULT NULL COMMENT 'bofide对接接口需要的参数';
ALTER TABLE `bf_bip_store` ADD COLUMN `token` varchar(100) DEFAULT NULL COMMENT 'bofide对接接口需要的参数';

/*
*   2017-09-15 给操作记录表新增一个字段
*   陈润林
*/
ALTER TABLE `bf_bip_customer_trace_recode` ADD COLUMN `newNextTraceDate` date DEFAULT NULL COMMENT '新的下次跟踪日期,主要用于页面显示用';
ALTER table bf_bip_customer_update_bihu MODIFY column insuranceTypeLY VARCHAR(1024) DEFAULT NULL COMMENT '去年投保险种';

/*
*  2017-09-19 新增一个上月留存潜客表,用于统计邀约率
*  胡良清
*/
DROP TABLE IF EXISTS `bf_bip_report_sylcqk`;
CREATE TABLE `bf_bip_report_sylcqk` (
	`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
	`storeId` int(11) NOT NULL COMMENT '4s店id',
	`userId` int(11) NOT NULL COMMENT '用户id',
	`renewalType` int(11) NOT NULL COMMENT '投保类型',
	`customerId` int(11) NOT NULL COMMENT '潜客id',
	`recordTime` date DEFAULT NULL COMMENT '创建时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_sylcqk` ADD INDEX sylcqk_storeId_index( `storeId` );
ALTER TABLE `bf_bip_report_sylcqk` ADD INDEX sylcqk_userId_index( `userId` );
ALTER TABLE `bf_bip_report_sylcqk` ADD INDEX sylcqk_renewalType_index( `renewalType` );

/*
*  2017-09-27 新增一个厂家表
*  陈润林
*/
DROP TABLE IF EXISTS `bf_bip_vender`;
CREATE TABLE `bf_bip_vender` (
	`id` int(6) NOT NULL AUTO_INCREMENT COMMENT '自增id',
	`venderName` varchar(50) DEFAULT NULL COMMENT '厂家名字',
	`venderEnglish` varchar(100) DEFAULT NULL COMMENT '厂家英文',
	`venderRemark` varchar(500) DEFAULT NULL COMMENT '备注',
	`recordTime` date DEFAULT NULL COMMENT '创建时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*
* 2017-09-28 给品牌新增一个品牌英文和厂家ID
*  陈润林
*/
ALTER TABLE `bf_bip_carbrand` ADD COLUMN `brandEnglish` varchar(100) DEFAULT NULL COMMENT '品牌英文';
ALTER TABLE `bf_bip_carbrand` ADD COLUMN `venderId` int(6) DEFAULT NULL COMMENT '厂家ID';

/*
* 2017-09-29 新增一个角色集团管理员
*  胡良清
*/
insert into bf_bip_role VALUES(40,'集团管理员');

/*
* 2017-09-29 用户表新增一个字段,集团id
*  胡良清
*/
ALTER TABLE `bf_bip_user` ADD COLUMN `jtId` int(11) DEFAULT NUll COMMENT '集团id';

/*
* 2017-09-29 新增一个集团表
*  胡良清
*/
DROP TABLE IF EXISTS `bf_bip_bloc`;
CREATE TABLE `bf_bip_bloc` (
	`jtId` int(11) NOT NULL AUTO_INCREMENT COMMENT '集团id',
	`jtName` varchar(40) NOT NULL COMMENT '集团名称',
	`jtShortName` varchar(40) NOT NULL COMMENT '集团名称缩写',
	`jtRegistName` varchar(40) NOT NULL COMMENT '集团工商注册名称',
	`jtCode` varchar(40) NOT NULL COMMENT '集团代号',
	`jtTaxNum` varchar(40) NOT NULL COMMENT '集团税号',
	`jtFzr` VARCHAR(40) NOT NULL COMMENT '集团负责人',
	`jtLxr` VARCHAR(40) NOT NULL COMMENT '集团联系人',
	`jtPhone` VARCHAR(40) NOT NULL COMMENT '集团电话',
	`jtEmail` VARCHAR(40) NOT NULL COMMENT '集团邮件',
	`jtAddress` VARCHAR(100) NOT NULL COMMENT '集团地址',
	`jtAdminAccount` varchar(50) NOT NULL COMMENT '集团AM账号',
	`jtAdminPassword` varchar(128) NOT NULL COMMENT '集团AM密码',
	`jtYxqStart` date DEFAULT NULL COMMENT '集团有效期开始时间',
	`jtYxqEnd` date DEFAULT NULL COMMENT '集团有效期结束时间',
	`jtDeleted` int(2) DEFAULT '0' COMMENT '集团删除标志,0否,1是',
	`jtDeleteDate` datetime DEFAULT NULL COMMENT '集团删除时间',
	`jtRemark` varchar(512) DEFAULT NULL COMMENT '集团备注',
	`jtCreateDate` datetime DEFAULT NULL COMMENT '集团创建时间',
	`jtUpdateDate` datetime DEFAULT NULL COMMENT '集团修改时间',
	PRIMARY KEY (`jtId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_bloc` ADD INDEX bloc_jtId_index( `jtId` );
ALTER TABLE `bf_bip_bloc` ADD INDEX bloc_jtName_index( `jtName` );

/*
* 2017-10-10 用户表 userName字段加长
*  胡良清
*/
ALTER table `bf_bip_user` MODIFY column `userName` VARCHAR(50) NOT NULL COMMENT '用户名';

/*
* 2017-10-12 4s店表添加字段
*  胡良清
*/
ALTER TABLE `bf_bip_store` ADD COLUMN `jtId` int(11) DEFAULT NUll COMMENT '集团id';
ALTER TABLE `bf_bip_store` ADD COLUMN `registName` varchar(40) NOT NULL COMMENT '工商注册名称';
ALTER TABLE `bf_bip_store` ADD COLUMN `taxNum` varchar(40) NOT NULL COMMENT '税号';
ALTER TABLE `bf_bip_store` ADD COLUMN `code` varchar(40) NOT NULL COMMENT '代号';
ALTER TABLE `bf_bip_store` ADD COLUMN `fzr` VARCHAR(40) NOT NULL COMMENT '负责人';
ALTER TABLE `bf_bip_store` ADD COLUMN `lxr` VARCHAR(40) NOT NULL COMMENT '联系人';
ALTER TABLE `bf_bip_store` ADD COLUMN `phone` VARCHAR(40) NOT NULL COMMENT '电话';
ALTER TABLE `bf_bip_store` ADD COLUMN `email` VARCHAR(40) NOT NULL COMMENT '邮件';
ALTER TABLE `bf_bip_store` ADD COLUMN `address` VARCHAR(100) NOT NULL COMMENT '地址';
ALTER TABLE `bf_bip_store` ADD COLUMN `vaildDateStart` date NOT NULL COMMENT '有效期开始时间';

/*
* 2017-10-16 4s店表 adminAccount 字段加长
*  胡良清
*/
ALTER table `bf_bip_store` MODIFY column `adminAccount` VARCHAR(50) NOT NULL COMMENT 'AM账号';

/*
* 2017-10-17 新增多个集团角色
*  陈润林
*/
insert into bf_bip_role VALUES(41,'集团总');
insert into bf_bip_role VALUES(42,'运营部总经理');
insert into bf_bip_role VALUES(43,'运营部总监');
insert into bf_bip_role VALUES(44,'运营部经理');
insert into bf_bip_role VALUES(45,'市场总经理');
insert into bf_bip_role VALUES(46,'市场总监');
insert into bf_bip_role VALUES(47,'市场经理');
insert into bf_bip_role VALUES(48,'衍生总经理');
insert into bf_bip_role VALUES(49,'衍生总监');
insert into bf_bip_role VALUES(50,'衍生经理');
insert into bf_bip_role VALUES(51,'事业部总经理');
insert into bf_bip_role VALUES(52,'销售总监');
insert into bf_bip_role VALUES(53,'销售经理');
insert into bf_bip_role VALUES(54,'市场总监');
insert into bf_bip_role VALUES(55,'市场经理');
insert into bf_bip_role VALUES(56,'售后总监');
insert into bf_bip_role VALUES(57,'售后经理');
insert into bf_bip_role VALUES(58,'衍生总监');
insert into bf_bip_role VALUES(59,'衍生经理');

/*
* 2017-10-17 新增一个集团部门表
*  陈润林
*/
DROP TABLE IF EXISTS `bf_bip_unit`;
CREATE TABLE `bf_bip_unit` (
	`id` int(9) NOT NULL AUTO_INCREMENT COMMENT '自增id',
	`jtId` int(11) DEFAULT NULL COMMENT '所属集团ID',
	`unitName` varchar(50) DEFAULT NULL COMMENT '事业部名字',
	`recordTime` date DEFAULT NULL COMMENT '创建时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `bf_bip_user` ADD COLUMN `unitId` int(9) DEFAULT NUll COMMENT '集团事业部ID';
ALTER TABLE `bf_bip_store` ADD COLUMN `unitId` int(9) DEFAULT NUll COMMENT '集团事业部ID';

/*
* 2017-10-19 现有数据车架号统一改成大写形式
*  胡良清
*/
update bf_bip_approval_bill a set a.chassisNumber = UPPER(a.chassisNumber);
update bf_bip_approval_bill_record a set a.chassisNumber = UPPER(a.chassisNumber);
update bf_bip_customer a set a.chassisNumber = UPPER(a.chassisNumber);
update bf_bip_customer_update_bihu a set a.chassisNumber = UPPER(a.chassisNumber);
update bf_bip_insurance_bill a set a.chassisNumber = UPPER(a.chassisNumber);
update bf_bip_push_maintenance a set a.chassisNumber = UPPER(a.chassisNumber);
update bf_bip_renewaling_customer a set a.chassisNumber = UPPER(a.chassisNumber);
update bf_bip_report_month_customer_trend_detail a set a.chassisNumber = UPPER(a.chassisNumber);
update bf_bip_message a set a.chassisNumber = UPPER(a.chassisNumber);
update bf_bip_sent_bihu_info a set a.carVin = UPPER(a.carVin);

/*
* 2017-10-19 集团和店相关信息改成非必填
*  胡良清
*/
ALTER TABLE `bf_bip_store` MODIFY COLUMN `registName` varchar(40) DEFAULT NULL COMMENT '工商注册名称';
ALTER TABLE `bf_bip_store` MODIFY COLUMN `taxNum` varchar(40) DEFAULT NULL COMMENT '税号';
ALTER TABLE `bf_bip_store` MODIFY COLUMN `code` varchar(40) DEFAULT NULL COMMENT '代号';
ALTER TABLE `bf_bip_store` MODIFY COLUMN `fzr` VARCHAR(40) DEFAULT NULL COMMENT '负责人';
ALTER TABLE `bf_bip_store` MODIFY COLUMN `lxr` VARCHAR(40) DEFAULT NULL COMMENT '联系人';
ALTER TABLE `bf_bip_store` MODIFY COLUMN `phone` VARCHAR(40) DEFAULT NULL COMMENT '电话';
ALTER TABLE `bf_bip_store` MODIFY COLUMN `email` VARCHAR(40) DEFAULT NULL COMMENT '邮件';
ALTER TABLE `bf_bip_store` MODIFY COLUMN `address` VARCHAR(100) DEFAULT NULL COMMENT '地址';
ALTER TABLE `bf_bip_store` MODIFY COLUMN `vaildDateStart` date DEFAULT NULL COMMENT '有效期开始时间';

ALTER TABLE `bf_bip_bloc` MODIFY COLUMN `jtRegistName` varchar(40) DEFAULT NULL COMMENT '集团工商注册名称';
ALTER TABLE `bf_bip_bloc` MODIFY COLUMN `jtTaxNum` varchar(40) DEFAULT NULL COMMENT '集团税号';
ALTER TABLE `bf_bip_bloc` MODIFY COLUMN `jtCode` varchar(40) DEFAULT NULL COMMENT '集团代号';
ALTER TABLE `bf_bip_bloc` MODIFY COLUMN `jtFzr` VARCHAR(40) DEFAULT NULL COMMENT '集团负责人';
ALTER TABLE `bf_bip_bloc` MODIFY COLUMN `jtLxr` VARCHAR(40) DEFAULT NULL COMMENT '集团联系人';
ALTER TABLE `bf_bip_bloc` MODIFY COLUMN `jtPhone` VARCHAR(40) DEFAULT NULL COMMENT '集团电话';
ALTER TABLE `bf_bip_bloc` MODIFY COLUMN `jtEmail` VARCHAR(40) DEFAULT NULL COMMENT '集团邮件';
ALTER TABLE `bf_bip_bloc` MODIFY COLUMN `jtAddress` VARCHAR(100) DEFAULT NULL COMMENT '集团地址';



/*
* 2017-10-24 店添加一个字段,标志是否启用客服模块
*  胡良清
*/
ALTER TABLE `bf_bip_store` ADD COLUMN `csModuleFlag` int(3) DEFAULT 1 COMMENT '是否启用客服模块,0表示不启用,1表示启用';

/*
*   2017-10-26 店添加一个字段,标志是否启用客服模块
*   胡良清
*/
INSERT INTO bf_bip_module_setting (fourSStoreId,moduleName,switchOn) SELECT	storeId,'csModule',	1 FROM bf_bip_store;

/*
* 2017-10-26 分配表加2个字段
*  陈润林
*/
ALTER TABLE `bf_bip_customer_assign` ADD COLUMN `applyStatu` int(3) DEFAULT NULL COMMENT '不启用客服模块后续保专员申请失销和睡眠的标志,1表示失销,2表示睡眠';
ALTER TABLE `bf_bip_customer_assign` ADD COLUMN `applyLossReason` VARCHAR(40) DEFAULT NULL COMMENT '申请失销原因暂存字段';

/*
* 2017-11-01 存放每天一开始时,应跟踪里面的潜客数
*  胡良清
*/
DROP TABLE IF EXISTS `bf_bip_report_day_need_trace`;
CREATE TABLE `bf_bip_report_day_need_trace` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `storeId` int(11) NOT NULL COMMENT '4s店id',
	`userId` int(11) NOT NULL COMMENT '用户id',
	`renewalType` int(11) NOT NULL COMMENT '投保类型',
	`needTraceCount` int(11) NOT NULL COMMENT '应跟踪潜客数',
	`recordTime` date DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_day_need_trace` ADD INDEX need_trace_storeId_index( `storeId` );
ALTER TABLE `bf_bip_report_day_need_trace` ADD INDEX need_trace_userId_index( `userId` );
ALTER TABLE `bf_bip_report_day_need_trace` ADD INDEX need_trace_renewalType_index( `renewalType` );

/*
* 2017-11-01 bf_bip_defeat_customer_relate表加1个字段
*  陈润林
*/
ALTER TABLE `bf_bip_user` ADD COLUMN `defeatClue` int(3) DEFAULT 0 COMMENT '销售战败线索平均分配标志';
ALTER TABLE `bf_bip_defeat_customer_relate` ADD COLUMN `userId` int(11) DEFAULT 0 COMMENT '持有人ID';
ALTER TABLE `bf_bip_defeat_customer_relate` ADD COLUMN `storeId` int(11) DEFAULT 0 COMMENT '所属店ID';
update bf_bip_defeat_customer_relate a set a.storeId = (select storeId from bf_bip_store b where b.bspStoreId = a.bsp_storeId);
update bf_bip_defeat_customer_relate set storeId = bip_storeId where bip_storeId > 0;

/*
* 2017-11-02 bf_bip_customer表加1个字段
*  陈润林
*/
ALTER TABLE `bf_bip_customer` ADD COLUMN `defeatFlag` int(3) DEFAULT 0 COMMENT '战败线索生成潜客的标志,1为自主建档，2为战败线索建档，0为其他';

/*
* 2017-11-06 bf_bip_defeat_customer_relate表加两个索引
*  陈润林
*/
ALTER TABLE `bf_bip_defeat_customer_relate` ADD INDEX defeat_customer_relate_userId( `userId` );
ALTER TABLE `bf_bip_defeat_customer_relate` ADD INDEX defeat_customer_relate_storeId( `storeId` );


/*
* 2017-11-11 操作记录表(bf_bip_operation_record)添加一个字段,用于表示关闭客服模块时, 主管同意失销或者同意睡眠
*	胡良清添加
*/
ALTER TABLE `bf_bip_operation_record` ADD COLUMN `returnFlag` int (3) DEFAULT 0 COMMENT '关闭客服模块时, 主管同意失销或者同意睡眠标志, 1表示同意失销,2表示同意睡眠';


/*
* 2017-11-21 新增一张原因表(bf_bip_reason), 用于配置回退失销原因
*	胡良清添加
*/
DROP TABLE IF EXISTS `bf_bip_reason`;
CREATE TABLE `bf_bip_reason` (
	`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
	`storeId` int(11) NOT NULL COMMENT '4s店id',
	`reason` varchar(40) NOT NULL COMMENT '回退/失销原因',
	`sort` int(11) NOT NULL COMMENT '排序',
	`status` int(1) NOT NULL DEFAULT '1' COMMENT '启用状态,1表示启用,2表示禁用',
	`disable` int(1) DEFAULT '1' COMMENT '是否可编辑删除, 0表示不可以,1表示可以',
	`createTime` datetime DEFAULT NULL COMMENT '创建时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_reason` ADD INDEX reason_storeId_index( `storeId` );

/*
* 2017-11-22 4s店表(bf_bip_store)添加一个字段,用于表示bip系统用哪一个公司的logo
*	胡良清添加
*/
ALTER TABLE `bf_bip_store` ADD COLUMN `logo` int(3) DEFAULT 1 COMMENT 'logo显示,1表示博福,2表示传慧嘉和';

/*
* 2017-11-29 新增异常数据表(bf_bip_report_day_exception), 异常数据明细表(bf_bip_report_day_exception_detail)
*	胡良清添加
*/
DROP TABLE IF EXISTS `bf_bip_report_day_exception`;
CREATE TABLE `bf_bip_report_day_exception` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `storeId` int(11) DEFAULT NULL COMMENT '4s店Id',
  `xId` int(11) DEFAULT NULL COMMENT '横坐标id',
  `xName` varchar(40) DEFAULT NULL COMMENT '横坐标名称',
  `yId` int(11) DEFAULT NULL COMMENT '纵坐标id',
  `yName` varchar(40) DEFAULT NULL COMMENT '纵坐标名称',
  `countValues` int(11) DEFAULT NULL COMMENT '统计值',
  `stack` int(11) DEFAULT NULL,
  `stackName` varchar(20) DEFAULT NULL,
	`roleId` int(11) DEFAULT NULL COMMENT '角色id',
  `recordTime` datetime DEFAULT NULL COMMENT '统计时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_day_exception` ADD INDEX exception_storeId_index( `storeId` );
ALTER TABLE `bf_bip_report_day_exception` ADD INDEX exception_roleId_index( `roleId` );

DROP TABLE IF EXISTS `bf_bip_report_day_exception_detail`;
CREATE TABLE `bf_bip_report_day_exception_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `storeId` int(11) NOT NULL COMMENT '4s店Id',
	`userId` int(11) NOT NULL COMMENT '用户Id',
	`stackName` varchar(40) NOT NULL COMMENT '柱子名称',
  `holderName` varchar(40) DEFAULT NULL COMMENT '持有人',
	`clerk` varchar(40) DEFAULT NULL COMMENT '业务员',
	`contact` varchar(40) DEFAULT NULL COMMENT '联系人',
	`contactWay` varchar(40) DEFAULT NULL COMMENT '联系电话',
	`chassisNumber` varchar(40) DEFAULT NULL COMMENT '车架号',
	`carLicenseNumber` varchar(40) DEFAULT NULL COMMENT '车牌号',
  `renewalType` varchar(40) DEFAULT NULL COMMENT '投保类型',
  `jqxrqEnd` date DEFAULT NULL COMMENT '交强险到期日',
  `syxrqEnd` date DEFAULT NULL COMMENT '商业险到期日',
  `customerLevel` varchar(40) DEFAULT NULL COMMENT '客户级别',
	`lastTraceDate` date DEFAULT NULL COMMENT '末次跟踪日期',
  `lastTraceResult` varchar(200) DEFAULT NULL COMMENT '末次跟踪结果',
  `willingTraceDate` date DEFAULT NULL COMMENT '应跟踪日期',
  `recordTime` date DEFAULT NULL COMMENT '统计时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_day_exception_detail` ADD INDEX exception_detail_storeId_index( `storeId` );
ALTER TABLE `bf_bip_report_day_exception_detail` ADD INDEX exception_detail_userId_index( `userId` );
ALTER TABLE `bf_bip_report_day_exception_detail` ADD INDEX exception_detail_stackName_index( `stackName` );
ALTER TABLE `bf_bip_report_day_exception_detail` ADD INDEX exception_detail_recordTime_index( `recordTime` );

/*
* 2017-12-13 bf_bip_store表加1个字段
*  陈润林
*/
insert into bf_bip_role VALUES(23,'区域分析师');
ALTER TABLE bf_bip_store ADD COLUMN `dataAnalystIds` varchar(200) DEFAULT NULL COMMENT '所属区域分析师ID';

/*
* 2017-12-14 修改保单商业险和交强险的日期格式, 支持时分秒
*	胡良清添加
*/
ALTER TABLE `bf_bip_insurance_bill` MODIFY column syxrqStart datetime DEFAULT NULL COMMENT '商业险开始日期';
ALTER TABLE `bf_bip_insurance_bill` MODIFY column syxrqEnd datetime DEFAULT NULL COMMENT '商业险结束日期';
ALTER TABLE `bf_bip_insurance_bill` MODIFY column jqxrqStart datetime DEFAULT NULL COMMENT '交强险开始日期';
ALTER TABLE `bf_bip_insurance_bill` MODIFY column jqxrqEnd datetime DEFAULT NULL COMMENT '交强险结束日期';

/*
* 2017-12-15 修改审批单商业险和交强险的日期格式, 支持时分秒
*	胡良清添加
*/
ALTER TABLE `bf_bip_approval_bill` MODIFY column jqxrqStart datetime DEFAULT NULL COMMENT '交强险开始日期';
ALTER TABLE `bf_bip_approval_bill` MODIFY column jqxrqEnd datetime DEFAULT NULL COMMENT '交强险结束日期';

ALTER TABLE `bf_bip_approval_bill_record` MODIFY column jqxrqStart datetime DEFAULT NULL COMMENT '交强险开始日期';
ALTER TABLE `bf_bip_approval_bill_record` MODIFY column jqxrqEnd datetime DEFAULT NULL COMMENT '交强险结束日期';

/*
* 2017-12-20 bf_bip_store表加1个字段
*  陈润林
*/
ALTER TABLE bf_bip_insurance_type ADD COLUMN `status` int(2) DEFAULT 0 COMMENT '是否有保额，0表示否，1表示是';
ALTER TABLE bf_bip_insurance_type ADD COLUMN `deleted` int(2) DEFAULT 0 COMMENT '是否禁用，0表示否，1表示是';

/*
* 2017-12-26 bf_bip_store表加1个字段
*  陈润林
*/
DROP TABLE IF EXISTS `bf_bip_insu_insuType`;
CREATE TABLE `bf_bip_insu_insuType` (
	`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
	`storeId` int(11) NOT NULL COMMENT '4s店ID',
	`insuId` int(11) NOT NULL COMMENT '保单或者审批单ID',
	`typeName` varchar(50) DEFAULT NULL COMMENT '险种名称',
	`coverage` double(20,2) DEFAULT '0.00' COMMENT '保额',
	`type` int(2) NOT NULL COMMENT '1表示保单，2表示审批单记录表,3表示审批单临时表',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `bf_bip_insu_insuType` ADD INDEX insu_insuType_storeId_index( `storeId` );
ALTER TABLE `bf_bip_insu_insuType` ADD INDEX insu_insuType_insuId_index( `insuId` );
ALTER TABLE `bf_bip_insu_insuType` ADD INDEX insu_insuType_type_index( `type` );
ALTER TABLE `bf_bip_insu_insutype` ADD UNIQUE INDEX `idNameType` (`insuId`,`typeName`,`type`);

ALTER TABLE bf_bip_insurance_bill ADD COLUMN `updateStatus` int(2) DEFAULT 0 COMMENT '是否被迁移，0表示否，1表示是';
ALTER TABLE bf_bip_approval_bill_record ADD COLUMN `updateStatus` int(2) DEFAULT 0 COMMENT '是否被迁移，0表示否，1表示是';
ALTER TABLE bf_bip_approval_bill ADD COLUMN `updateStatus` int(2) DEFAULT 0 COMMENT '是否被迁移，0表示否，1表示是';


/*
* 2018-01-19 KPI日报添加销售顾问和服务顾问的数据, bf_bip_report_day_kpi_xsgw, bf_bip_report_day_kpi_fwgw
*  胡良清
*/
drop table if exists `bf_bip_report_day_kpi_xsgw`;
CREATE TABLE `bf_bip_report_day_kpi_xsgw` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `storeId` int(11) DEFAULT NULL COMMENT '4s店Id',
  `userId` int(11) DEFAULT NULL COMMENT '用户id',
  `userName` varchar(40) DEFAULT NULL COMMENT '用户名',
  `gzrs` int(11) DEFAULT NULL COMMENT '跟踪人数',
  `gzwcrs` int(11) DEFAULT NULL COMMENT '跟踪完成人数',
  `htrs` int(11) DEFAULT NULL COMMENT '回退人数',
  `recordTime` datetime DEFAULT NULL COMMENT '统计时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_day_kpi_xsgw` ADD INDEX report_day_kpi_xsgw_storeId_index( `storeId` );

drop table if exists `bf_bip_report_day_kpi_fwgw`;
CREATE TABLE `bf_bip_report_day_kpi_fwgw` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `storeId` int(11) DEFAULT NULL COMMENT '4s店Id',
  `userId` int(11) DEFAULT NULL COMMENT '用户id',
  `userName` varchar(40) DEFAULT NULL COMMENT '用户名',
  `gzrs` int(11) DEFAULT NULL COMMENT '跟踪人数',
  `gzwcrs` int(11) DEFAULT NULL COMMENT '跟踪完成人数',
  `htrs` int(11) DEFAULT NULL COMMENT '回退人数',
  `recordTime` datetime DEFAULT NULL COMMENT '统计时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_day_kpi_fwgw` ADD INDEX report_day_kpi_fwgw_storeId_index( `storeId` );


/*
* 2018-01-23 保险公司表添加一个字段表示博福报价key,用于识别报价了什么保险公司
*  胡良清
*/
ALTER TABLE bf_bip_insurance_company ADD COLUMN insuranceKey VARCHAR(40) DEFAULT NULL COMMENT '博福保险公司key值';


/*
* 2018-01-31 
* 审批单和保单添加3个字段, 表示现金优惠点位,储值卡金额,储值卡金额点位
* 赠品表,赠送记录临时表和赠送记录表添加一个额度字段, 支持储值卡和积分
*  胡良清
*/
ALTER TABLE bf_bip_approval_bill ADD COLUMN xjyhdw double(16,2) DEFAULT '0.00' COMMENT '现金优惠点位';
ALTER TABLE bf_bip_approval_bill ADD COLUMN czkje double(16,2) DEFAULT '0.00' COMMENT '储值卡金额';
ALTER TABLE bf_bip_approval_bill ADD COLUMN czkjedw double(16,2) DEFAULT '0.00' COMMENT '储值卡金额点位';

ALTER TABLE bf_bip_approval_bill_record ADD COLUMN xjyhdw double(16,2) DEFAULT '0.00' COMMENT '现金优惠点位';
ALTER TABLE bf_bip_approval_bill_record ADD COLUMN czkje double(16,2) DEFAULT '0.00' COMMENT '储值卡金额';
ALTER TABLE bf_bip_approval_bill_record ADD COLUMN czkjedw double(16,2) DEFAULT '0.00' COMMENT '储值卡金额点位';

ALTER TABLE bf_bip_insurance_bill ADD COLUMN xjyhdw double(16,2) DEFAULT '0.00' COMMENT '现金优惠点位';
ALTER TABLE bf_bip_insurance_bill ADD COLUMN czkje double(16,2) DEFAULT '0.00' COMMENT '储值卡金额';
ALTER TABLE bf_bip_insurance_bill ADD COLUMN czkjedw double(16,2) DEFAULT '0.00' COMMENT '储值卡金额点位';

ALTER TABLE bf_bip_gift_management ADD COLUMN quota int(11) DEFAULT '0' COMMENT '额度';
ALTER TABLE bf_bip_giving_information ADD COLUMN quota int(11) DEFAULT '0' COMMENT '额度';
ALTER TABLE bf_bip_giving_information_record ADD COLUMN quota int(11) DEFAULT '0' COMMENT '额度';

/*
* 2018-02-01 赠送记录表添加一个本次消费明细字段
* 添加一个核销记录表
*  胡良清
*/
ALTER TABLE bf_bip_giving_information_record ADD COLUMN bcxfDetail VARCHAR(200) DEFAULT NULL COMMENT '本次消费明细';

drop table if exists `bf_bip_hx_record`;
CREATE TABLE `bf_bip_hx_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '核销记录自增id',
  `storeId` int(11) NOT NULL COMMENT '4S店id',
  `approvalBillId` int(11) NOT NULL COMMENT '审批单id',
  `giftCode` varchar(40) DEFAULT NULL COMMENT '赠品编码',
  `giftName` varchar(40) DEFAULT NULL COMMENT '赠品名称',
  `giftType` int(3) DEFAULT NULL COMMENT '赠品类型,1:服务类;2.精品类;3.礼包类;4.储值卡;5.会员积分',
  `amount` int(11) DEFAULT '0' COMMENT '数量',
  `bcxfDetail` varchar(200) DEFAULT NULL COMMENT '本次消费明细',
  `surplusNum` int(5) DEFAULT '0' COMMENT '剩余数量',
  `thisUseNum` int(5) DEFAULT '0' COMMENT '本次使用数量',
  `hxTime` date DEFAULT NULL COMMENT '核销时间',
  `hxr` varchar(40) DEFAULT NULL COMMENT '核销人',
  `hxrId` int(11) DEFAULT NULL COMMENT '核销人Id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_hx_record` ADD INDEX hx_record_storeId_index( `storeId` );
ALTER TABLE `bf_bip_hx_record` ADD INDEX hx_record_approvalBillId_index( `approvalBillId` );



/*
* 2018-02-07 添加一个手续费率修改记录表
*  胡良清
*/
drop table if exists `bf_bip_update_sxf_record`;
CREATE TABLE `bf_bip_update_sxf_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '核销记录自增id',
  `storeId` int(11) NOT NULL COMMENT '4S店id',
  `insurerComId` int(11) NOT NULL COMMENT '保险公司id',
  `insuranceName` varchar(20) NOT NULL COMMENT '险种名称',
  `percentBefore` float(11,2) DEFAULT '0.00' COMMENT '修改前的手续费百分比',
  `percentAfter` float(11,2) DEFAULT '0.00' COMMENT '修改后的手续费百分比',
  `changeTime` date DEFAULT NULL COMMENT '修改时间',
  `changer` varchar(40) DEFAULT NULL COMMENT '修改人',
  `changerId` int(11) DEFAULT NULL COMMENT '修改人Id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_update_sxf_record` ADD INDEX update_sxf_record_storeId_index( `storeId` );
/*
* 2018-02-07 保单添加两个字段记录下保单当时的商业险手续费率或者交强险手续费率
*  胡良清
*/
ALTER TABLE bf_bip_insurance_bill ADD COLUMN syxsxfRate float(11,2) DEFAULT '0.00' COMMENT '商业险手续费百分比';
ALTER TABLE bf_bip_insurance_bill ADD COLUMN jqxsxfRate float(11,2) DEFAULT '0.00' COMMENT '交强险手续费百分比';

/*
* 2018-02-09 新增一个KPI月报按保险公司表,以前该报表的表作废
*  胡良清
*/
drop table if exists `bf_bip_report_month_kpi_company`;
CREATE TABLE `bf_bip_report_month_kpi_company` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `storeId` int(11) DEFAULT NULL COMMENT '4s店Id',
  `insuranceCompName` varchar(40) DEFAULT NULL COMMENT '保险公司名称',
  `type` int(11) DEFAULT NULL COMMENT '保单类型:1表示新保全,2表示新保贷,3表示续保',
  `jqxcds` int(11) DEFAULT NULL COMMENT '交强险出单数',
  `syxcds` int(11) DEFAULT NULL COMMENT '商业险出单数',
  `cdsSum` int(11) DEFAULT NULL COMMENT '出单数合计',
  `jqxbf` double(16,2) DEFAULT NULL COMMENT '交强险保费',
  `syxbf` double(16,2) DEFAULT NULL COMMENT '商业险保费',
  `bfSum` double(16,2) DEFAULT NULL COMMENT '保费合计',
  `jqxsxfRate` double(16,2) DEFAULT NULL COMMENT '交强险手续费率',
  `syxsxfRate` double(16,2) DEFAULT NULL COMMENT '商业险手续费率',
  `jqxsxfAmount` double(16,2) DEFAULT NULL COMMENT '交强险手续费金额',
  `syxsxfAmount` double(16,2) DEFAULT NULL COMMENT '商业险手续费金额',
  `sxfAmountSum` double(16,2) DEFAULT NULL COMMENT '手续费金额合计',
  `recordTime` datetime DEFAULT NULL COMMENT '统计时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_report_month_kpi_company` ADD INDEX kpi_company_storeId_index( `storeId` );
ALTER TABLE `bf_bip_report_month_kpi_company` ADD INDEX kpi_company_type_index( `type` );

/*
* 2017-02-27
*陈润林
*/
drop table if exists `bf_bip_jpush`;
CREATE TABLE `bf_bip_jpush` (
  `id` int(9) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `userId` int(11) NOT NULL COMMENT '用户id',
  `tag` varchar(50) NOT NULL COMMENT '设配标签',
  `registrationId` varchar(50) NOT NULL COMMENT '设配ID',
  `alias` varchar(50) NOT NULL COMMENT '设配别名',
  `updateDate` datetime NOT NULL COMMENT '修改时间',
  `createDate` datetime NOT NULL COMMENT '创建时间',
  `storeId` int(11) NOT NULL COMMENT '店ID',
  `logoFlag` int(11) NOT NULL COMMENT '公司标志,1表示博福,2表示传慧嘉和',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `bf_bip_jpush` ADD INDEX jpush_registrationId_index( `registrationId` );
ALTER TABLE `bf_bip_jpush` ADD INDEX jpush_userId_index(userId);
ALTER TABLE `bf_bip_jpush` ADD INDEX jpush_storeId_index( `storeId` );
ALTER TABLE `bf_bip_jpush` ADD INDEX jpush_logoFlag_index( `logoFlag` );

