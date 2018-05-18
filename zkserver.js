var childprocess = require('child_process');
var worker = childprocess.fork('./zkworker.js');

console.log('pid in master:', process.pid);
var childMessage="";
//监听子进程事件
worker.on('message', function(msg) {
  childMessage=msg;
  console.log('1:', msg);//监听子进程zk数据，并将zk节点数据打印
})
process.on('message', function(msg) {
  console.log('2:', msg);
})

worker.send('主进程给子进程传递的数据');

//触发事件 message
process.emit('message', '------');



var thrift = require("thrift");
var zkDataService = require("./gen-nodejs/zkDataService");
var ttypes = require("./gen-nodejs/tutorial_types");

var data = {};

var server = thrift.createServer(zkDataService, {
  zkData: function(result) {
    result(null, childMessage);//将zk节点数据返回
  }
});

server.listen(9090);

