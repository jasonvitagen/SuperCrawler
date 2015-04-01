var ws = require('nodejs-websocket')
    , server = ws
                .createServer(function (connection) {

                    console.log('new connection');

                    connection.on('text', function (str) {
                        connection.sendText('hello from server');
                    });

                    connection.on('close', function (code, reason) {
                        console.log('connection closed');
                    });

                })
                .listen(3001);

module.exports = server;