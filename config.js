/*
 * 配置文件
 *
 */
'use strict'

var path = require('path');
var util = require('./libs/util');

var wechat_file = path.join(__dirname,'./config/wechat.txt');

var config = {
	wechat:{
		appID:'wxfd0500f1ef27aca4',
		appSecret:'40e34bc92a37c72be7a41368ffce2394',
		token:'kanhuifeng',
		getAccessToken:function(){
			return util.readFileAsync(wechat_file);
		},
		saveAccessToken:function(data){
			return util.writeFileAsync(wechat_file,data);
		},
	}
};

module.exports = config;
