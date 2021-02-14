import PureHttp from 'pure-http';
import Service from './Service';

class Gateway extends Service {
  constructor({ name }) {
    super({ name });

    this.app = PureHttp();
  }

  routesRegistration() {
    throw new Error(`'routesRegistration' must be override.`);
  }

  start() {
    this.app.listen(8080, () => {
      console.log('...');

      this.subscribe();
    });
  }
}

export default Gateway;
