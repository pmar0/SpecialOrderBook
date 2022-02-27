require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json(),express.urlencoded({ extended: true }));

app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}));

app.use(cookieParser());

require("./config/mongoose.config");
require("./routes/users.routes")(app);
require("./routes/specialorders.routes")(app);

const port = 8000;
app.listen( port, () => console.log(`Listening on port: ${port}`) );