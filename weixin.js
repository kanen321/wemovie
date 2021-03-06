/*
 * 处理weixin的业务逻辑
 * replay、支付、错误信息的通知等
 */
'use strict'


var config = require('./config');
var Wechat = require('./wechat/wechat');
var menu = require('./menu');
var crawler = require('./crawler/crawler')

var wechatApi = new Wechat(config.wechat);

exports.reply = function* (next){
	var message = this.weixin;

	if(message.MsgType === 'event'){
		if(message.Event === 'subscribe'){
			if(message.EventKey) {
				console.log('扫描二维码关注：'+ message.EventKey +' '+ message.ticket);
			}
			this.body = '终于等到你，还好我没放弃';
		}else if(message.Event === 'unsubscribe'){
			this.body = '';
			console.log(message.FromUserName + ' 悄悄地走了...');
		}else if(message.Event === 'LOCATION'){
			this.body = '您上报的地理位置是：'+ message.Latitude + ',' + message.Longitude;
		}else if(message.Event === 'CLICK'){
			this.body = '您点击了菜单：'+ message.EventKey;
		}else if(message.Event === 'SCAN'){
			this.body = '关注后扫描二维码：'+ message.Ticket;
		}
	}
	else if(message.MsgType === 'text'){
		var content = message.Content;
		var reply = '你说的话：“' + content + '”，我听不懂呀';
		if(content === '1'){
			reply = '金刚:骷髅岛';
		}
		else if(content === '2'){
			var data = yield wechatApi.uploadTempMaterial('image',__dirname+'/public/king.jpg');
			reply = {
				type:'image',
				mediaId:data.media_id
			}
		}
		else if(content === '3'){
			var data = yield wechatApi.uploadTempMaterial('voice',__dirname+'/public/aiyou.mp3');
			reply = {
				type:'voice',
				mediaId:data.media_id
			}
		}
		else if(content === '4'){
			reply = [{
				title:'金刚.骷髅岛',
				description:'南太平洋上的神秘岛屿——骷髅岛。史上最大金刚与邪恶骷髅蜥蜴的较量。',
				picUrl:'http://tu.23juqing.com/d/file/html/gndy/dyzz/2017-04-09/da9c7a64ab7df196d08b4b327ef248f2.jpg',
				url:'http://www.piaohua.com/html/dongzuo/2017/0409/31921.html'
			}];
		}
		else if(content === '5'){
			var groups = yield wechatApi.getGroups();
			console.log('获取到如下分组：\n'+ JSON.stringify(groups));
		}
		else if(content === '6'){
			var msg = yield wechatApi.moveUsersToGroup(message.FromUserName,114);
			var groups = yield wechatApi.getGroups();
			console.log('获取到如下分组：\n'+ JSON.stringify(groups));
		}
		else if(content === '7'){
			var remark = yield wechatApi.updateUserRemark(message.FromUserName,'芒果屋里的猫');
			reply = "您的备注名已经被设置为："+remark;
		}
		else if(content === '8'){
			var data1 = yield wechatApi.fetchUserInfo(message.FromUserName);
			console.log(JSON.stringify(data1));
			var data2 = yield wechatApi.fetchUserInfo([message.FromUserName]);
			console.log(JSON.stringify(data2))
		}
		else if(content === '9'){
			var data1 = yield wechatApi.getUserOpenIds();
			console.log(JSON.stringify(data1));
			var data2 = yield wechatApi.getUserOpenIds(message.FromUserName);
			console.log(JSON.stringify(data2));
		}
		else if (content === '10') {
			var msg = yield wechatApi.sendTemplateMsg();
			console.log('msg:'+ JSON.stringify(msg));	
		}
		else if(content === '17'){
			var text = {
	      content:'这是群发消息测试唔~'
	   	};
			var msg = yield wechatApi.massSendMsg('text',text,114);
			console.log('msg:'+ JSON.stringify(msg));
		}
		// ... 其他回复类型
		this.body = reply;
	}

	yield next;
}

exports.setMenu = function* (){
	wechatApi.deleteMenu().then(function(){
		return wechatApi.createMenu(menu);
	}).then(function(msg){
		console.log('createMenu:'+msg);
	});
}

exports.sendMsg = function* (){
	var movieList = yield crawler.getMovieList();
	console.log(movieList);

}