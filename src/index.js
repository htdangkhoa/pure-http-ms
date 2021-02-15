import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  });

  console.log('mongodb connected.');

  const serviceName = process.argv[2];

  const { default: Service } = await import(`./services/${serviceName}`);

  const service = new Service({ name: serviceName });

  service.start();
})();
