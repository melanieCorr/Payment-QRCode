const smtp = require('..');

smtp.send({
  from: 'mail@lsong.org',
  to: 'test@localhost',
  subject: 'hello world',
  body: {
    _: 'This is a test message, do not reply.'
  }
}).then(res => {
  console.log(res);
});