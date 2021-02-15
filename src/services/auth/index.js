import Service from 'core/Service';
import UserModel from 'models/user.model';

class AuthSrv extends Service {
  async register(payload, done) {
    try {
      const instance = new UserModel({
        firstName: payload.body.firstName,
        lastName: payload.body.lastName,
      });

      const user = await instance.save();

      return done(user);
    } catch (error) {
      return done(error);
    }
  }

  async login(payload, done) {
    return done({ name: 'login' });
  }
}

export default AuthSrv;
