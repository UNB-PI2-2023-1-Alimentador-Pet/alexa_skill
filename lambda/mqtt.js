const mqtt = require('mqtt');

const host = 'test.mosquitto.org';
const port = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
let isConnected = false;

const connectUrl = `mqtt://${host}:${port}`;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
});

const connectMqtt = async (topic) => {
  client.on('connect', () => {
    client.subscribe(topic, () => {
      isConnected = true;
    });
  });
}

const publishMessage = async (topic, message) => {
  client.on('connect', () => {
    client.subscribe(topic, (error) => {
      if (!error) {
        console.log('chegou');
        client.publish(topic, JSON.stringify(message), { qos: 0, retain: false }, () => {
        });
      } else {
        console.error('Failed to subscribe to topic:', error);
      }
    });
  });
};

module.exports = {
  publishMessage,
};
