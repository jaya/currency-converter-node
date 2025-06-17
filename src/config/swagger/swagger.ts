import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { Express } from 'express';
const localhost = process.env.APP_URL;
const port = process.env.PORT;
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.1.0',
    info: {
      title: 'Currency Converter API',
      version: '1.0.0',
      description: 'Documentation Currency Converter API',
    },
    servers: [
      {
        url: `${localhost}:/${port}`,
      },
    ],
  },
  apis: ['./src/routes/index.ts'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

const setupSwagger = (app: Express) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default setupSwagger;
