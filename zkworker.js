console.log('pid in worker:', process.pid);

process.on('message', function(msg) {
  console.log('3:', msg);
});

var i=0;

var zookeeper = require('node-zookeeper-client');
var client = zookeeper.createClient('172.17.0.8:2181');
var path = '/zk_test';//节点名称
 


function getData(client, path) {
    client.getData(
        path,
        function (event) {
            console.log('Got event: %s', event);
            getData(client, path);
        },
        function (error, data, stat) {
            if (error) {
                console.log('Error occurred when getting data: %s.', error);
                return;
            }
            process.send('zookeeper节点数据'+data.toString('utf8'));//通知主进程zk节点数据
        }
    );
}


 
client.once('connected', function () {
    console.log('Connected to ZooKeeper.');
    getData(client, path);
});
 
client.connect();

process.emit('message', '======');

