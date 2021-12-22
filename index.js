const express = require('express')
const app = express()
const cors = require("cors");
const db = require("./models");
const port = 3000
const user = require('./routes/user')

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/user', user);

db.sequelize.sync();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
