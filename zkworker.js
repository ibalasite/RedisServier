console.log('pid in worker:', process.pid);

process.on('message', function(msg) {
  console.log('3:', msg);
});

var i=0;

var zookeeper = require('node-zookeeper-client');
var client = zookeeper.createClient('zookeeper:2181');
var path = '/RedisServer';
 


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
            process.send(data.toString('utf8'));
        }
    );
}


 
client.once('connected', function () {
    console.log('Connected to ZooKeeper.');
    getData(client, path);
});
 
client.connect();

process.emit('message', '======');

