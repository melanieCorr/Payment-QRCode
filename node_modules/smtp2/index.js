const dns = require('dns');
const tcp = require('net');
const util = require('util');
const Message = require('mime2');
const EventEmitter = require('events');
const createReader = require('./parser');

const debug = util.debuglog('smtp2');

const connect = (host, port) => {
  return new Promise((resolve, reject) => {
    const socket = tcp.connect(port, host, () => resolve(socket));
    socket.once('error', reject);
  });
};

const tryConnect = async (hosts, port = 2525) => {
  for(const host of hosts){
    try{
      const socket = await connect(host, port);
      debug(`MX connection created: ${host}:${port}`);
      return socket;
    }catch(e){
      debug(`Error on connectMx for: ${host}:${port}`, e);
    }
  }
  throw new Error('can not connect to any SMTP server');
};

class SMTP extends EventEmitter {
  resolve(domain){
    const resolveMx = util.promisify(dns.resolveMx);
    return resolveMx(domain)
    .catch(() => [])
    .then(records => {
      return records
        .sort((a, b) => a.priority - b. priority)
        .map(mx => mx.exchange)
        .concat([domain]);
    });
  }
  connect(domain){
    return this
      .resolve(domain)
      .then(tryConnect);
  }
  async post(host, from, recipients, body){
    let queue = [], step = 0;
    queue.push(`MAIL FROM: ${from.address}`);
    queue = queue.concat(recipients.map(address => {
      const addr = Message.parseAddress(address);
      return `RCPT TO: ${addr.address}`;
    }));
    queue.push('DATA');
    queue.push('QUIT');
    queue.push('');
    const process = (sock, done, msg) => {
      debug('<-', msg);
      const w = b => {
        debug('->', b);
        sock.write(b + Message.CRLF);
      }
      const code = parseInt(msg, 10);
      switch(code){
        case 220:
          if(/ESMTP/i.test(msg)){
            w(`EHLO ${from.host}`);
          }else{
            w(`HELO ${from.host}`);
          }
          break;
        case 250:
          w(queue[step++]);
          break;
        case 354:
          w(body);
          w('');
          w('.');
          w('');
          break;
        case 221:
          done(null, 'OK');
          break;
        default:
          done(new Error(`SMTP responds error: ${msg}`));
          break;
      };
    };
    return this
      .connect(host)
      .then(socket => {
        return new Promise((resolve, reject) => {
          const done = (err, res) => {
            if(err) return reject(err);
            resolve(res);
          };
          socket.on('error', reject);
          socket.on('data', createReader(
            process.bind(socket, socket, done)
          ));
        });
      });
  }
  send(message){
    if(!(message instanceof Message))
      message = new Message(message);
    let groupByHost = {}, recipients = [];
    if(message.to) recipients.push(message.to);
    if(message.cc) recipients.push(message.cc);
    if(message.bcc)recipients.push(message.bcc);
    recipients = recipients.map(recipient => {
      const addr = Message.parseAddress(recipient);
      (groupByHost[ addr.host ] ||
      (groupByHost[ addr.host ] = [])).push(addr.address);
      return addr.address;
    });
    const from = Message.parseAddress(message.from);
    return Promise.all(Object.keys(groupByHost).map(domain => 
      this.post(domain, from, groupByHost[domain], message.toString())));
  }
}

SMTP.send = (message, options) => {
  const smtp = new SMTP(options);
  return smtp.send(message);
};

SMTP.Server = require('./server');
SMTP.createServer = (options, handler) => {
  return new SMTP.Server(options, handler);
};

module.exports = SMTP;