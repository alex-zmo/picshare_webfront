let connect = require('connect');
let serveStatic = require('serve-static');

connect()
    .use(serveStatic(__dirname + '/static/'))
    .listen(80, () => console.log('Server running on 80...'));