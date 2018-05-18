var zookeeper = require('node-zookeeper-client');

var client = zookeeper.createClient('zookeeper:2181');
var path = process.argv[2];

function listChildren(client, path) {
    client.getChildren(
        path,
        function (event) {
            console.log('Got watcher event: %s', event);
            listChildren(client, path);
        },
        function (error, children, stat) {
            if (error) {
                console.log(
                    'Failed to list children of %s due to: %s.',
                    path,
                    error
                );
                return;
            }

            console.log('Children of %s are: %j.', path, children);
            client.getData(path, function(error,data){
                if (error) {
                    return error.stack; 
                }
                var RedisServer = JSON.parse(data);
                console.log('DATA is  %j', RedisServer);
                console.log(RedisServer.list);
                console.log('RedisServer.list length %d',RedisServer.list.length);
                console.log('RedisServer.list last value ',RedisServer.list[RedisServer.list.length-1]);
                 client.close();
                //return data ? data.toString() : undefined;

            });
            console.log('stat is %j .', JSON.parse(JSON.stringify(stat)));

        }
    );
}

client.once('connected', function () {
    console.log('Connected to ZooKeeper.');
    listChildren(client, path);
});

client.connect();
