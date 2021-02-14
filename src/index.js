import dotenv from 'dotenv';
import Gateway from 'core/Gateway';

dotenv.config();

console.log('_____', process.env.NODE_ENV);

(async () => {
  const serviceName = process.argv[2];

  const { default: Service } = await import(`./services/${serviceName}`);

  const service = new Service({ name: Service.name });

  if (service instanceof Gateway) {
    const routeSchemas = Service.prototype.routesRegistration();

    const routes = Object.entries(routeSchemas);

    for (let i = 0; i < routes.length; i += 1) {
      const [key, value] = routes[i];

      const path = `/${serviceName}/api/${key}`.replace(/\/{2,}/g, '/');

      const method = (value.method || 'GET').toLowerCase();

      service.app[method](path, (req, res, next) => value.handler.call(service, req, res, next));
    }
  }

  service.start();
})();
