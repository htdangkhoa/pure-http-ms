import Service from 'core/Service';

class ArticleSrv extends Service {
  async pong(payload, done) {
    return done({ age: 25 });

    // done(new Error('test'));
  }
}

export default ArticleSrv;
