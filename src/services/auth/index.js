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
}

export default AuthSrv;
