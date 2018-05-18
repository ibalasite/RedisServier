var thrift = require('thrift');
var zkDataService = require('./gen-nodejs/zkDataService');

var transport = thrift.TBufferedTransport;
var protocol = thrift.TBinaryProtocol;

var connection = thrift.createConnection("localhost", 9090, {
  transport : transport,
  protocol : protocol
});

connection.on('error', function(err) {
    console.log("error:"+err);
 // assert(false, err);
});

var client = thrift.createClient(zkDataService, connection);

client.zkData(function(err, message) {
    if(err) console.log("error:" + err);
     var RedisServer = JSON.parse(message);
     console.log('zkDATA is  %j', RedisServer);
     console.log(RedisServer.list);
     console.log('RedisServer.list length %d',RedisServer.list.length);
     console.log('RedisServer.list last value ',RedisServer.list[RedisServer.list.length-1]);
    //close the connection once we're done
    connection.end();
  });
