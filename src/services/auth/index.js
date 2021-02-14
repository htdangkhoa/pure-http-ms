import Service from 'core/Service';

class AuthSrv extends Service {
  async register(payload, done) {
    return done({ name: 'register' });
  }

  async login(payload, done) {
    return done({ name: 'login' });
  }
}

export default AuthSrv;
