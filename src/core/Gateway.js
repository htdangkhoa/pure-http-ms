import PureHttp from 'pure-http';
import cors from 'cors';
import bodyParser from 'body-parser';

import { DEFAULT_GATEWAY } from 'constants/service-names';

import Service from './Service';

class Gateway extends Service {
  constructor({ name }) {
    super({ name });

    this.app = PureHttp();

    this.loadMiddlewares();
  }

  loadMiddlewares() {
    this.app.use(cors({ credentials: true }));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  routesRegistration() {
    throw new Error(`'routesRegistration' must be override.`);
  }

  loadRoutes() {
    const router = this.routesRegistration();

    const routes = Object.entries(router);

    for (let i = 0; i < routes.length; i += 1) {
      const [functionName, route] = routes[i];

      const path = `/${this.serviceName}/api/${functionName}`.replace(/\/{2,}/g, '/');

      const method = (route.method || 'GET').toLowerCase();

      this.app[method](path, async (req, res, next) => {
        if (route.svc === DEFAULT_GATEWAY) {
          return this[functionName](req, res, next);
        }

        const payload = {
          params: req.params,
          query: req.query,
          body: req.body,
          headers: req.headers,
          fromGateway: this.serviceName,
        };

        const response = await this.communication.callTo(route.svc, functionName, payload);

        return res.status(200).json(response);
      });
    }
  }

  start() {
    this.loadRoutes();

    this.app.listen(8080, () => {
      console.log('...');

      this.subscribe();
    });
  }
}

export default Gateway;
