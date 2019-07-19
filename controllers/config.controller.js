const request = require('request')
exports.validad2 = (req, res) => {
  const cpf = (req.body.cpf != undefined) ? req.body.cpf : null;
  if (cpf) {
    const body = {
      id: process.env.MARATONA_ID,
      cpf: cpf,
      api_key: process.env.IAM_APIKEY,
      classifier_id: process.env.CLASSIFIER_ID,
      type_id: process.env.DEVICE_TYPE,
      org_id: process.env.ORG_ID,
      iot_key: process.env.API_KEY,
      token: process.env.AUTH_TOKEN,
      desafio: process.env.DESAFIO
    };
    console.log(body)
    if (!body) {
      res.status(404).json({
        msg: 'Something is missing'
      })
    } else {
      request({
        uri: 'https://8d829621.us-south.apiconnect.appdomain.cloud/desafios/desafio5',
        body: body,
        json: true,
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        }
      }, function (err, response) {
        if (err || response.body.error) {
          console.log(err);
          res.status(500).json({
            msg: 'Something is wrong, contact support.'
          });
        } else {
          if (body.err != undefined && body.err == true) {
            res.status(500).json({
              msg: 'Something is wrong, contact support.',
              err: true
            });
          } else {
            res.status(201).json({
              msg: response.body,
            });
          }
        }
      });
    }
  }
  else res.status(404).json({
    msg: 'Something is missing'
  });
}
