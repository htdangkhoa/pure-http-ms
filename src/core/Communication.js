import * as Nats from 'nats';
import { isNil } from 'utils';

const TIMEOUT_MS = 30000;

const SERVICE_ERROR = 'ERROR_AT_REPLYING_SERVICE';

const { JSONCodec } = Nats;

class Communication {
  #connection;

  #codec = JSONCodec();

  constructor() {
    this.#connection = Nats.connect({
      servers: process.env.NATS_URL,
      timeout: TIMEOUT_MS,
      waitOnFirstConnect: true,
    });
  }

  subscribe(serviceName, callback) {
    const topic = `${serviceName}.*`;

    return new Promise((resolve, reject) => {
      this.#connection
        .then(async (nc) => {
          const callbackSubscription = (error, message) => {
            const data = { success: false };

            const payload = this.#codec.decode(message.data);

            callback(payload, (response) => {
              if (response instanceof Error) {
                const e = new Error(response.message);
                e.code = SERVICE_ERROR;
                e.stack = response.stack;
                e.chainedError = response.chainedError;

                data.success = false;
                data.error = e;

                return message.respond(this.#codec.encode(data));
              }

              if (!isNil(response)) {
                data.success = true;
                data.data = response;
              }

              return message.respond(this.#codec.encode(data));
            });
          };

          const subscription = nc.subscribe(topic, {
            callback: callbackSubscription,
            queue: topic,
          });

          resolve(subscription);
        })
        .catch(reject);
    });
  }

  async callTo(serviceName, functionName, payload) {
    const topic = `${serviceName}.${functionName}`;

    const _payload = payload || {};

    if (!_payload?.nats?.serviceName) {
      _payload.nats = { serviceName, functionName };
    }

    let responder;

    return new Promise((resolve, reject) => {
      this.#connection
        .then(async (nc) => nc.request(topic, this.#codec.encode(_payload), { noMux: true }))
        .then((message) => {
          const data = this.#codec.decode(message.data);

          responder = data;
        })
        .catch((error) => {
          responder = error;
        })
        .finally(() => {
          if (responder instanceof Error) {
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
