import Communication from './Communication';
import Logger from './Logger';

class Service {
  constructor({ name }) {
    this.serviceName = name;

    this.communication = new Communication();

    this.logger = new Logger(process.env.NODE_ENV === 'production');
  }

  start() {
    this.subscribe();
  }

  subscribe() {
    this.communication.subscribe(this.serviceName, (payload, done) => {
      try {
        const { nats, ...data } = payload;

        if (typeof this[nats?.functionName] === 'function') {
          this[nats?.functionName]?.(data, done);
        }
      } catch (error) {
        done(error);
      }
    });
  }
}

export default Service;
