import bcrypt from 'bcryptjs';

import Service from 'core/Service';
import UserModel from 'models/user.model';
import { sign } from 'utils/jwt';

import { loginRequestSchema, registerRequestSchema } from './validator';

class AuthSrv extends Service {
  async register(payload, done) {
    try {
      const { error, value } = registerRequestSchema.validate(payload.body);

      if (error) return done(error);

      const salt = bcrypt.genSaltSync();

      const instance = new UserModel({
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        password: bcrypt.hashSync(value.password, salt),
      });

      const user = await instance.save();

      return done(user);
    } catch (error) {
      return done(error);
    }
  }

  async login(payload, done) {
    try {
      const { error, value } = loginRequestSchema.validate(payload.body);

      if (error) return done(error);

      const user = await UserModel.findOne({ email: value.email });

      if (!user) return done(new Error('The email or password you entered is incorrect.'));

      const isMatch = bcrypt.compareSync(value.password, user.password);

      if (!isMatch) return done(new Error('The email or password you entered is incorrect.'));

      const { password, ...authUser } = user.toJSON();

      const token = sign(authUser);

      return done({ cookie: { name: 'token', value: token }, token });
    } catch (error) {
      return done(error);
    }
  }
}

export default AuthSrv;
