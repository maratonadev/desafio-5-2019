const path = require("path")
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const visual_recognition_router = require('./routes/visual-recognition-routes.route');
const config = require('./routes/config.routes')
const IotRoute = require('./routes/IoT.route');

const app = express();
app.set('port', process.env.PORT || 4000);

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1/visual-recognition', visual_recognition_router);
app.use('/api/v1/config', config);
app.use('/api/v1/', IotRoute)

app.use("/", express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(app.get('port'), '0.0.0.0', () => {
  console.log(`Server starting on => ${app.get('port')} `);
})
