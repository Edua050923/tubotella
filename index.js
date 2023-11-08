const express = require('express');
const Sequelize = require('sequelize'); // Usar Sequelize como ORM
const bcrypt = require('bcrypt'); // Usar bcrypt para cifrar las contraseñas
const { body, validationResult } = require('express-validator'); // Usar express-validator para validar los datos de entrada
const app = express();
app.use(express.json());
// Crear una instancia de Sequelize con la configuración de la base de datos
const db = new Sequelize('tubotella', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});
// Definir un modelo de conductor con los campos y las validaciones correspondientes
const Conductors = db.define('conductors', {
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  direccion: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  telefono: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isInt: true
    }
  },
  provincia: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  ci: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isInt: true
    }
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});
// Sincronizar el modelo con la base de datos
db.sync();

app.post('/register', 
  // Usar un array de middlewares de validación para comprobar los datos de entrada
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('direccion').notEmpty().withMessage('La dirección es obligatoria'),
    body('telefono').notEmpty().withMessage('El teléfono es obligatorio').isNumeric().withMessage('El teléfono debe ser numérico').custom(async value => {
      // Comprobar si el teléfono ya existe en la base de datos
      const conductors = await Conductors.findOne({ where: { telefono: value } });
      if (conductors) {
        throw new Error('El teléfono ya existe');
      }
      return true;
    }),
    body('provincia').notEmpty().withMessage('La provincia es obligatoria'),
    body('ci').notEmpty().withMessage('El CI es obligatorio').isNumeric().withMessage('El CI debe ser numérico').custom(async value => {
      // Comprobar si el CI ya existe en la base de datos
      const conductors = await Conductors.findOne({ where: { ci: value } });
      if (conductors) {
        throw new Error('El CI ya existe');
      }
      return true;
    }),
    body('email').notEmpty().withMessage('El email es obligatorio').isEmail().withMessage('El email debe ser válido').custom(async value => {
      // Comprobar si el email ya existe en la base de datos
      const conductors = await Conductors.findOne({ where: { email: value } });
      if (conductors) {
        throw new Error('El email ya existe');
      }
      return true;
    }),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
  ],
  async (req, res) => {

  // Obtener los resultados de la validación
  const errors = validationResult(req);

  // Si hay errores, enviar una respuesta con los mensajes de error
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {

    // Obtener los datos del cuerpo de la petición
    const {nombre, direccion, telefono, provincia, ci, email, password} = req.body;

    // Cifrar la contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo conductor con los datos y la contraseña cifrada
await Conductors.create({
  nombre, direccion, telefono, provincia, ci, email, password: hashedPassword
});
    
   res.json({message:'Usuario registrado'});

 } catch (error) {
   // Mostrar el mensaje de error de Sequelize o de la base de datos
   res.status(500).json({error: error.message});
 }
});
// Iniciar server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
