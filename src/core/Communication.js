import Nats from 'nats';

const MAX_LISTENER = 1;

const TIMEOUT_MS = 5000;

const SERVICE_ERROR = 'ERROR_AT_REPLYING_SERVICE';

class Communication {
  #natsClient;

  constructor() {
    this.#natsClient = Nats.connect({ url: process.env.NATS_URL, json: true });

    this.#natsClient.on('connect', () => {
      console.log('Nats connected');
    });
  }

  subscribe(serviceName, callback) {
    const topic = `${serviceName}.*`;

    const subscriberId = this.#natsClient.subscribe(topic, (payload, replyTo) => {
      callback(payload, (responder) => {
        if (responder instanceof Error) {
          const data = new Nats.NatsError(responder.message, SERVICE_ERROR, responder.stack || responder.chainedError);

          return this.#natsClient.publish(replyTo, data);
        }

        return this.#natsClient.publish(replyTo, responder);
      });
    });

    return { topic, subscriberId };
  }

  callTo(serviceName, functionName, payload) {
    const topic = `${serviceName}.${functionName}`;

    let _payload = payload || {};

    if (!_payload?.nats?.serviceName) {
      _payload.nats = { serviceName, functionName };
    }

    return new Promise((resolve, reject) => {
      this.#natsClient.requestOne(topic, _payload, { max: MAX_LISTENER }, TIMEOUT_MS, (responder) => {
        if (responder instanceof Nats.NatsError && responder.code === Nats.REQ_TIMEOUT) {
          return reject(responder);
        } else if (responder.code === SERVICE_ERROR) {
          return reject(responder);
        } else {
          return resolve(responder);
        }
      });
    });
  }
}

export default Communication;
