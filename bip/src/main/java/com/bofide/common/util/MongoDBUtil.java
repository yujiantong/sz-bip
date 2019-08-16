package com.bofide.common.util;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.bson.Document;

import com.bofide.bip.po.Suggest;
import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
 
//mongodb 连接数据库工具类
@SuppressWarnings("all")
public class MongoDBUtil {
    
 
    //需要密码认证方式连接
    
	public static MongoDatabase getConnect(){
        List<ServerAddress> adds = new ArrayList<>();
        //ServerAddress()两个参数分别为 服务器地址 和 端口
        ServerAddress serverAddress = new ServerAddress("120.27.246.195", 27017);//121.43.196.37
        adds.add(serverAddress);
        
        List<MongoCredential> credentials = new ArrayList<>();
        //MongoCredential.createScramSha1Credential()三个参数分别为 用户名 数据库名称 密码
        MongoCredential mongoCredential = MongoCredential.createScramSha1Credential("bsp_sale", "bsp_sale", "bofideMongo".toCharArray());
        credentials.add(mongoCredential);
        
        //通过连接认证获取MongoDB连接
        MongoClient mongoClient = new MongoClient(adds, credentials);
 
        //连接到数据库
        MongoDatabase mongoDatabase = mongoClient.getDatabase("bsp_sale");
 
        //返回连接数据库对象
        return mongoDatabase;
    }
	//获取连接和定义的集合
	public static MongoCollection<Document> getConnectAndCollection() {
		//获取数据库连接对象
		MongoDatabase mongoDatabase = MongoDBUtil.getConnect();
		//获取集合
		MongoCollection<Document> collection = mongoDatabase.getCollection("userSuggest");
		return collection;
	}
	public static Suggest documtToSuggest(Document doc, Suggest suggest) {
		 suggest.setId(doc.get("_id") ==null ? "" : doc.get("_id").toString());
		 suggest.setUuId(doc.get("uuId") ==null ? "" : doc.get("uuId").toString());
		 suggest.setTitle(doc.get("title") ==null ? "" : doc.get("title").toString());
		 suggest.setContent(doc.get("content") ==null ? "" : doc.get("content").toString());
		 suggest.setUserId(Integer.valueOf(doc.get("userId").toString()));
		 suggest.setUserName(doc.get("userName") ==null ? "" : doc.get("userName").toString());
		 suggest.setStoreName(doc.get("tissueName") ==null ? "" : doc.get("tissueName").toString());
		 suggest.setStatus(doc.get("state") ==null ? null : (Integer)doc.get("state"));
		 suggest.setProposeTime(doc.get("recordTime") ==null ? null : doc.getDate("recordTime"));
		 suggest.setUserPhone(doc.get("tel") ==null ? "" : doc.get("tel").toString());
		 suggest.setSolveTime(doc.get("responseTime") ==null ? null : doc.getDate("responseTime"));
		 suggest.setDisContent(doc.get("reposeDesc") ==null ? "" : doc.get("reposeDesc").toString());
		 suggest.setUserRoleName(doc.get("positionName") ==null ? "" : doc.get("positionName").toString());
		return suggest;
	}
    public static String getUUID(){
        UUID uuid=UUID.randomUUID();
        String str = uuid.toString(); 
        String uuidStr=str.replace("-", "");
        return uuidStr;
      }
}

