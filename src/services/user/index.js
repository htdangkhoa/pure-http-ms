import Service from 'core/Service';
import { verify } from 'utils/jwt';

class UserSvc extends Service {
  getUser(payload, done) {
    const user = verify(payload.cookies?.token);

    return done(user);
  }
}

export default UserSvc;
