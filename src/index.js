import Gateway from 'core/Gateway';

(async () => {
  const serviceName = process.argv[2];

  const { default: Service } = await import(`./services/${serviceName}`);

  const service = new Service({ name: Service.name });

  if (service instanceof Gateway) {
    const handlerNames = Object.getOwnPropertyNames(Service.prototype).filter((n) => n !== 'constructor');

    for (let i = 0; i < handlerNames.length; i += 1) {
      const name = handlerNames[i];

      service.app.post(`/api/${name}`, function (req, res, next) {
        service[name].call(service, req, res, next);
      });
    }
  }

  service.start();
})();
