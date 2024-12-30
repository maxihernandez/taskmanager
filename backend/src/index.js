const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');
const taskRoutes = require('./routes/tasksRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');
const app = express();

// Middleware para permitir CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Ruta para las tareas
app.use('/api/task', taskRoutes);

//Agrego Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Ruta principal
app.get('/', (req, res) => {
    res.send('¡Hola! El servidor está funcionando correctamente.');
});

// Inicia el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
