var http = require("http");
var url = require("url");

var lisFn = function(req, rsp){
	var actType = "";
	var actTarUrl = "";
	var isInputData = false;
	var bufRef;
	/*req.pipe(rsp);*/
	
	console.log("request's method: " + req.method);
	console.log("request's URL: " + req.url);
	/*console.log("request's socket: " + req.socket);
	console.log("request's header object: ");
	for(var p in req.headers)
		console.log("\t" + p + ": " + req.headers[p]);*/
	/*console.log("Request Raw Header: ");
	for(var i = 0, len = req.rawHeaders.length; i < len; i+=2)
		console.log(req.rawHeaders[i] + ": " + req.rawHeaders[i+1]);*/
	var qObj = url.parse(req.url, true).query;
	actType = qObj.action || "get";
	actTarUrl = qObj.dsturl || "http://www.baidu.com/";
	isInputData = (qObj.bdata === "1") ? true : false;
	console.log("\n");
	
	
	
	if(isInputData)
	{
		req.on('data', function(chunk){
			bufRef = Buffer.concat([bufRef,chunk]);
		});
		req.on('end', function(){
			var reqStr = "";
			var reqJsonObj = "root:{}";
			if(bufRef)
			{
				reqStr = bufRef.toString('utf8');
				reqJsonObj = JSON.parse(reqStr);
			}
			
			console.log(bufRef);
			console.log(reqStr);
			console.log(reqJsonObj);
			
			//send request to baidu.com
			//get response to response
			rsp.write('<p>Hello, Your <span style="font-weight:bold;">[' + actType + ']</span> request for <span style="font-weight:bold;">[' + actTarUrl + ']</span> with data <span style="font-weight:bold;">[' + reqStr + '] will send back to replace this</p>');
		});
	}
	else
	{
		//send request to baidu.com
		//get response to response
		rsp.write('<p>Hello, Your <span style="font-weight:bold;">[' + actType + ']</span> request for <span style="font-weight:bold;">[' + actTarUrl + ']</span> will send back to replace this</p>');
		var dstObj = url.parse(actTarUrl);
		var proReq = http.request({
			host: dstObj.host,
			method: actType.toUpperCase(),
			path: dstObj.path
		}, function(dstRsp){
			dstRsp.pipe(rsp);
		});
		proReq.end();
	}
	req.on('close', function(){
		delete bufRef;
	});
};

var hs = http.createServer(lisFn);
hs.listen(8080);