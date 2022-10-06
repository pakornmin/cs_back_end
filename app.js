const express = require('express');
const app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors =  require('cors');
require('dotenv').config();


//Swagger Option
const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Climate Shopper API with Swagger",
        version: "1.0.0",
        description:
          "This is a simple CRUD API application made with Express and documented with Swagger",
        contact: {
          name: "Min Nunta-aree",
          email: "pakornmin@@gmail.com",
        },
      },
    },
    apis: [`${__dirname}/controllers/*.js`],
};


//Swagger Documentation
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


//Middlewares
app.use(bodyParser.json({ limit: '3000mb' }));
app.use(cors());


//Import Routes
const companyDataRoute = require('./controllers/companyData')
app.use('/companyData', companyDataRoute);


//ROUTE
app.get('/', (req, res) => {
    res.send('The api is working!');
});



//Connect to DB
mongoose.connect(process.env.DB_CONNECTION,
    {useNewUrlParser: true}, 
    () => {
    console.log('connected to mongodb')
})


//listen
app.listen(process.env.PORT);