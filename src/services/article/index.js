import Service from 'core/Service';

class ArticleSrv extends Service {
  async pong(payload, done) {
    // this.communication.callTo('AuthSrv', 'ping', { age: 24 });

    // return done({ age: 24 });

    done(new Error('test'));
  }
}

export default ArticleSrv;
