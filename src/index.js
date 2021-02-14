import dotenv from 'dotenv';

dotenv.config();

(async () => {
  const serviceName = process.argv[2];

  const { default: Service } = await import(`./services/${serviceName}`);

  const service = new Service({ name: serviceName });

  service.start();
})();
