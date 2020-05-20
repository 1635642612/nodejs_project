	
	//启动服务 首页访问路径为 http://localhost:8888
  initServer();  
  function initServer(){
    var express = require('express');  //调用模板
    var app = express();
    var bodyParser = require('body-parser');  //调用模板
	var session = require('express-session');
	var FileStore = require('session-file-store')(session);
	var moment = require('moment');
	//*********************************************************
	var path = require('path');
	var ejs = require('ejs');  //我是新引入的ejs插件
	app.set('views', path.join(__dirname, 'static'));//设置html模板根目录
	app.engine('html', ejs.__express); //设置html引擎
	app.set('view engine', 'html');
	//*********************************************************
	var connection = null;  //数据库连接对象
    //创建编码解析
    var urlencodedParser = bodyParser.urlencoded({ extended: false })
	//创建session存储用户信息
	var identityKey = 'skey';
    app.use(session({
        name: identityKey,
        secret: 'mynodeserver',  // 用来对session id相关的cookie进行签名
        store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
        saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
        resave: false,  // 是否每次都重新保存会话，建议false
        cookie: {
            maxAge: 30*60 * 1000  ,// 有效期，单位是毫秒
			//设置maxAge，即半小时后session和相应的cookie失效过期
        }
    }));
	
	 /* app.use(function(req, res, next) {
	
	  if (!req.session.user) {
	    if (req.url == "/login.html"  ) {
	      next(); //如果请求的地址是登录则通过，进行下一个请求
	    } else {
	       res.sendFile(__dirname+"/"+login.html);//跳转到登录页面
	    }
	  } else if (req.session.user) {
	    next();//如果已经登录，则可以进入
	  }
	}); */ 
	
    app.use(express.static('static'));  //设置静态文件目录
	  //数据库方法
	  function mysql_connec() {
	    var mysql = require("mysql");
	     connection = mysql.createConnection({  //配置参数，然后添加你的数据库里面的表
	        host: 'localhost',
	        user: 'root',
	        password: '123456',
	        database: 'xiecheng'
	    })
	    connection.connect();  //连接
	}
	
    
    var server = app.listen(8888, function () {  //监听端口
    var host = server.address().address
    var port = server.address().port
	mysql_connec();  //连接数据库
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
    })
    
/*----------------------------- 路由 ----------------------------- */	
	//登录页面
	app.get('/login.html',function(req,res){
	    res.sendFile(__dirname+"/"+login.html); //提供静态文件
	})
	//首页页面
	app.get('/', function (req, res) {  //get请求
		 if(req.session.user){
		    var userName = req.session.user.username;
			res.cookie("username", userName, {maxAge:  30*60 * 1000, httpOnly: true})
		} else{
			res.cookie("username", "", {maxAge:0, httpOnly: true})
		}
	   res.sendFile(__dirname+"/"+index.html);
	})
	//登录处理
	app.post('/doLogin', urlencodedParser, function (req, response) {  //post处理方法
	   // 输出 JSON 格式
	   var requser = {
	       "username":req.body.username,   //得到页面提交的数据
	       "password":req.body.password
	   };
	   var userMsg ={msg:"",userInfo:""};
	    //连接数据库
	    var selectSql = "select * from user where username = ? and password = ?";
		 var selectParm = [requser.username, requser.password];
	    connection.query(selectSql, selectParm, function(err, res) {
	        if(err) {
	            console.log('[select error]-', err.message);
	            return;
	        }
			if(res.length==0){
				userMsg.msg ="fail";
				response.send(userMsg); //返回的数据
				response.end();
				return;
			}
			req.session.user = res[0];
	        console.log(req.session.user.username+"-----------------------");
			//响应模板
			/* response.render('login', {
			        isLogined:"true",
			        username:res[0].username
			 }); */
			userMsg.msg ="success";
			userMsg.userInfo = res[0];
			response.send(userMsg);
			response.end(); 
	   	
	    })
	   
	})
	//注册
	app.post('/doReg', urlencodedParser, function (req, response) {  //post处理方法
	   // 输出 JSON 格式
	   var requser = {
	       "username":req.body.username,   //得到页面提交的数据
	       "password":req.body.password
	   };
	    //连接数据库
		//查询用户是否存在
		var insrtSql = "select *from user where username = ?  "
		var insertParm = [requser.username];
		connection.query(insrtSql, insertParm, function(err, res) {
		    if(err) {
		        console.log('[select error]-', err.message);
				response.send("fail"); //返回的数据
				response.end();
		        return;
		    }
			console.log(res);
			if(res.length>0){
				response.send("exist");
				response.end(); 
				return;
			}
		})
		//注册用户
		 console.log("----------注册用户---------")
	    var selectSql = "insert into user  (username,password) values (?,?)";
		 var selectParm = [requser.username, requser.password];
	    connection.query(selectSql, selectParm, function(err, res) {
	        if(err) {
	            console.log('[select error]-', err.message);
				response.send("fail"); //返回的数据
				response.end();
	            return;
	        }
			console.log(res);
			response.send("success");
			response.end(); 
	   	
	    })
	   
	})
	// 退出登录
	 app.get('/logout', function(req, res, next){
	    // 备注：这里用的 session-file-store 在destroy 方法里，并没有销毁cookie
	    // 所以客户端的 cookie 还是存在，导致的问题 --> 退出登陆后，服务端检测到cookie
	    // 然后去查找对应的 session 文件，报错
	    // session-file-store 本身的bug    
	
	    req.session.destroy(function(err) {
	        if(err){
	            res.json({ret_code: 2, ret_msg: '退出登录失败'});
	            return;
	        }
	        // req.session.loginUser = null;
	        res.clearCookie(identityKey);
			res.cookie("username", "", {maxAge: 0, httpOnly: true})
	        res.redirect('/');
	    });
	}); 
	
	//首页数据查询
	 app.get('/doSearch', function (req, response) {  //get请求
		 var requser = {
			 "start":req.query.start,   //得到页面提交的数据
			 "target":req.query.target
		 };
		 //连接数据库
		// var selectSql = "select * from flight where start like ? and target like ?";
		var selectSql = "select * from (select * from flight  where start like ? and target like ?) a  left join ticket b on a.fid = b.flightNo"
		  var selectParm = ['%'+requser.start+'%', '%'+requser.target+'%'];
		  connection.query(selectSql, selectParm, function(err, res) {
		     if(err) {
		         console.log('[select error]-', err.message);
		         return;
		     }
		 	//响应模板
		 	/* response.render('login', {
		 	        isLogined:"true",
		 	        username:res[0].username
		 	 }); */
			 console.log(res);
			 for(var i=0; i < res.length; i++) { 
				 res[i].startTime = moment( res[i].startTime ).format('YYYY-MM-DD HH:mm')
				 res[i].endTime = moment( res[i].endTime ).format('YYYY-MM-DD HH:mm')
			  }
			// var current_time =  moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
			 response.render('page/flight', {
			         data:res
			  }); 
		 
		 })
	})
	//订票
	
	app.get('/doTicket', function (req, response) {  //get请求
		 var requser = {
			 "id":req.query.tid,   //得到页面提交的数据
		 };
		 //连接数据库
		var selectSql = "select * from (select * from ticket where tid =?) a  left join flight b on a.flightNo = b.fid"
		  var selectParm = [requser.id];
		  connection.query(selectSql, selectParm, function(err, res) {
		     if(err) {
		         console.log('[select error]-', err.message);
		         return;
		     }
			 console.log(res);
			// var current_time =  moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
			res[0].startTime = moment( res[0].startTime ).format('YYYY-MM-DD HH:mm');
			res[0].endTime = moment( res[0].endTime ).format('YYYY-MM-DD HH:mm');
			 response.render('page/ticket', {
			         data:res[0]
			  }); 
		 
		 })
	})
	
	
	
  }