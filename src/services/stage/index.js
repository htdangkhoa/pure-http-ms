import Gateway from 'core/Gateway';
import { AUTH_SVC_NAME, DEFAULT_GATEWAY } from 'constants/service-names';

class Stage extends Gateway {
  ping(req, res) {
    res.json({ name: 'Khoa' });
  }

  routesRegistration() {
    return {
      ping: { svc: DEFAULT_GATEWAY },
      register: { svc: AUTH_SVC_NAME, method: 'POST' },
      login: { svc: AUTH_SVC_NAME },
    };
  }
}

export default Stage;
