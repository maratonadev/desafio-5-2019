const Client = require('ibmiotf');
require('dotenv').load();

let payload_saved;

const config = {
  "org": process.env.ORG_ID,
  "auth-key": process.env.API_KEY,
  "auth-token": process.env.AUTH_TOKEN,
  "id": process.env.DEVICE_ID,
  "domain": "internetofthings.ibmcloud.com",
};

const configDevice = {
  "org": process.env.ORG_ID,
  "id": process.env.DEVICE_ID,
  "domain": "internetofthings.ibmcloud.com",
  "type": process.env.DEVICE_TYPE,
  "auth-method": "use-token-auth",
  "auth-token": process.env.DEVICE_TOKEN
}

console.log(configDevice)
const appClient = new Client.IotfApplication(config);

appClient.connect();

appClient.on('connect', function () {
  appClient.subscribeToDeviceStateEvents();
  appClient.subscribeToDeviceEvents('+', '+', 'temperatura', 'json');
});

appClient.on("deviceEvent", (deviceType, deviceId, eventType, fmt, payload) => {
  if (payload != undefined) {
    payload_saved = JSON.parse(payload);
  }
  console.log(payload_saved);
});

const sendData = (status) => {
  return new Promise((resolve, reject) => {
    const deviceClient = new Client.IotfDevice(configDevice);
    deviceClient.connect();
    deviceClient.on('connect', () => {
      deviceClient.publish("alerta", "json", `{"d" : ${status} }`);
      deviceClient.disconnect();
      resolve('connected');
    });
  });
}

// Implemente a regra de validação do alerta do status

exports.iotAlert = (req, res) => {
  const body = payload_saved != undefined ? payload_saved : null;
  let status;
  if (body != null) {
    if (payload_saved.temperatura <= 5) {
      status = 'normal'
    } else if (payload_saved.temperatura > 5 && payload_saved.temperatura <= 15) {
      status = 'alerta'
    } else {
      status = 'critico';
    }
    sendData(status).then(data => res.send({ payload: status, temperatura: payload_saved.temperatura }))
      .catch(err => res.send({ payload: status, temperatura: payload_saved.temperatura }));
  }
  else res.send({ payload: 'none' });
}
