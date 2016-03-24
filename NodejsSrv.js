var http = require("http");
var url = require("url");

var lisFn = function(req, rsp){
	var actType = "";
	var actTarUrl = "";
	var bufArr=[];//buffer object container
	
	var qObj = url.parse(req.url, true).query;
	actType = qObj.action || "get";
	actTarUrl = qObj.dsturl || "http://www.baidu.com/";
	console.log("request's URL: " + req.url);
	console.log("parameter [action]: " + actType);
	console.log("parameter [dsturl]: " + actTarUrl);
	console.log("\n");
	
	req.on('data', function(chunk){bufArr.push(chunk);//push an Buffer object ot Array.});
	req.on('end', function(){
		var wholeBuf;
		var reqStr = "";
		var reqJsonObj = "root:{}";
		if(bufArr.length > 0)
		{
			wholeBuf = Buffer.concat(bufArr);//Buffer.concat() function concat serveral buffer object to a new buffer object.
			bufArr = [];//release the tmporay array.
			reqStr = wholeBuf.toString('utf8');
			reqJsonObj = JSON.parse(reqStr);
		}
		console.log(wholeBuf);
		console.log(reqStr);
		console.log(reqJsonObj);
		rsp.write('<p>Hello, Your <span style="font-weight:bold;">[' + actType + ']</span> request for <span style="font-weight:bold;">[' + actTarUrl + ']</span> with data <span style="font-weight:bold;">[' + reqStr + '] start on proxy server now.</p>');
		rsp.end();
	});
	
	req.on('close', function(){
		delete bufRef;
	});
};

var hs = http.createServer(lisFn);
hs.listen(8080);