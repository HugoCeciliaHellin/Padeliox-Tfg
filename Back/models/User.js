const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'El nombre de usuario es obligatorio' },
      len: {
        args: [2, 50],
        msg: 'El nombre de usuario debe tener entre 2 y 50 caracteres'
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Email inválido' },
      notEmpty: { msg: 'El email es obligatorio' }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100],
        msg: 'La contraseña debe tener entre 6 y 100 caracteres'
      }
    },
    notEmpty: { msg: 'La contraseña no puede estar vacía' }


  },
  role: {
    type: DataTypes.ENUM('organizer', 'player'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['organizer', 'player']],
        msg: 'Rol inválido'
      }
    }
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'refresh_token' 
  }
}, {
  timestamps: true,
  underscored: true,    
  tableName: 'users',
  defaultScope: {
    attributes: { exclude: ['password', 'refreshToken'] }
  }
});

module.exports = User;
