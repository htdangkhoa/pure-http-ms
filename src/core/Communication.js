import Nats from 'nats';
import { isNil } from 'utils';

const MAX_LISTENER = 1;

const TIMEOUT_MS = 5000;

const SERVICE_ERROR = 'ERROR_AT_REPLYING_SERVICE';

class Communication {
  #natsClient;

  constructor() {
    this.#natsClient = Nats.connect({ url: process.env.NATS_URL, json: true });

    this.#natsClient.on('connect', () => {
      console.log('Nats connected.');
    });
  }

  subscribe(serviceName, callback) {
    const topic = `${serviceName}.*`;

    const subscriberId = this.#natsClient.subscribe(topic, { queue: serviceName }, (payload, replyTo) => {
      callback(payload, (response) => {
        const data = { success: false };

        if (response instanceof Error) {
          const error = new Nats.NatsError(response.message, SERVICE_ERROR, response.stack || response.chainedError);

          error.originName = response.code || response.constructor.name || error.constructor.name;

          data.success = false;
          data.error = error;

          return this.#natsClient.publish(replyTo, data);
        }

        data.success = false;

        if (!isNil(response)) {
          data.data = response;
        }

        return this.#natsClient.publish(replyTo, data);
      });
    });

    return { topic, subscriberId };
  }

  callTo(serviceName, functionName, payload) {
    const topic = `${serviceName}.${functionName}`;

    const _payload = payload || {};

    if (!_payload?.nats?.serviceName) {
      _payload.nats = { serviceName, functionName };
    }

    return new Promise((resolve, reject) => {
      this.#natsClient.requestOne(topic, _payload, { max: MAX_LISTENER }, TIMEOUT_MS, (responder) => {
        if (responder instanceof Nats.NatsError && responder.code === Nats.REQ_TIMEOUT) {
          return reject(responder);
        }

        if (responder.code === SERVICE_ERROR) {
          return reject(responder);
        }

        return resolve(responder);
      });
    });
  }
}

export default Communication;
