function nodeAjax(action, url, senddata, parseFn)
{
    var a = new XMLHttpRequest();
    var proxyServer = "http://localhost:8080/"; //my local nodejs server.
    a.open("POST", proxyServer+"?action=" + action + "&dsturl="+url, true); //open(method, url, async)
    a.onreadystatechange = parseFn;
    a.send(senddata || null);
}

