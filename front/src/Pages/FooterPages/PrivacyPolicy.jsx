import './PrivacyPolicy.css';

const PrivacyPolicy = () => (
    <div className="main-app">
  <div className="page privacy-policy">
    <h1>Política de Privacidad</h1>
    <p>En PADELIIOX nos comprometemos a proteger tu privacidad. A continuación te explicamos cómo recopilamos, utilizamos y protegemos tus datos.</p>

    <section>
      <h2>1. Información que recopilamos</h2>
      <p>Recopilamos datos que tú mismo nos proporcionas al registrarte y usar el servicio (nombre, email, reservas, etc.) y datos de uso (logs, IP, etc.).</p>
    </section>

    <section>
      <h2>2. Uso de la información</h2>
      <p>Utilizamos tus datos para autenticarte, gestionar tus reservas y enviarte comunicaciones relevantes. Nunca compartimos tu información con terceros sin tu consentimiento.</p>
    </section>

    <section>
      <h2>3. Seguridad</h2>
      <p>Implementamos medidas técnicas y organizativas para proteger tus datos contra accesos no autorizados o pérdida.</p>
    </section>

    <section>
      <h2>4. Tus derechos</h2>
      <p>Puedes solicitar en cualquier momento el acceso, rectificación o eliminación de tus datos escribiéndonos a privacidad@padeliiox.com.</p>
    </section>
  </div>
  </div>
);

export default PrivacyPolicy;
