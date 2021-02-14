import Gateway from 'core/Gateway';

class AuthSrv extends Gateway {
  async ping(req, res) {
    try {
      const result = await this.communication.callTo('ArticleSrv', 'pong', { name: 'Khoa' });

      res.json({ hello: 'world', result });
    } catch (error) {
      res.json({ error });
    }
  }

  routesRegistration() {
    return {
      ping: {
        handler: this.ping,
        method: 'GET',
      },
    };
  }
}

export default AuthSrv;
