import Communication from './Communication';

class Service {
  constructor({ name }) {
    this.serviceName = name;

    this.communication = new Communication();
  }

  start() {
    this.subscribe();
  }

  subscribe() {
    this.communication.subscribe(this.serviceName, (payload, done) => {
      const { nats, ...data } = payload;

      if (typeof this[nats?.functionName] === 'function') {
        this[nats?.functionName]?.(data, done);
      }
    });
  }
}

export default Service;