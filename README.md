#  Padeliox - TFG

**Plataforma web para reservas de pistas de pádel**, desarrollada como Trabajo de Fin de Ciclo (DAW). Ofrece autenticación segura, pagos integrados con Stripe, control de reservas y gestión de usuarios en tiempo real.

---

##  Características principales

-  Autenticación con JWT (access + refresh tokens)
-  Roles diferenciados: jugador y administrador
-  Visualización y reserva de pistas disponibles
-  Pagos integrados con Stripe (modo prueba)
-  Historial de partidas y estadísticas personales
-  Interfaz moderna, responsive y accesible

---

##  Tecnologías utilizadas

### Backend (`/Back`)
- Node.js + Express
- Sequelize (ORM) + MySQL 8
- Autenticación JWT
- Stripe SDK para pagos
- Validaciones, control de errores y rate limiting

### Frontend (`/front`)
- React 17 + React Router v6
- Axios con interceptores y gestión de tokens
- AuthContext para sesión persistente
- Stripe.js + react-stripe-js
- Estilo responsive con CSS modular
