import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "./LoginUniversal.scss";
import fondoLogin from "../../assets/login/login_background.jpg";

export default function LoginUniversal() {
  const [isLogin, setIsLogin] = useState(true);
  const [tipoUsuario, setTipoUsuario] = useState("voluntario");
  const [validado, setValidado] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados Formulario Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados Formulario Registro
  const [regNombre, setRegNombre] = useState("");
  const [regApellido, setRegApellido] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regNombreOrg, setRegNombreOrg] = useState("");
  const [regTelefono, setRegTelefono] = useState("");
  const [regSitioWeb, setRegSitioWeb] = useState("");
  const [regDescripcion, setRegDescripcion] = useState("");

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    setValidado(false);
    setError("");
    setExito("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setError("");

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidado(true);
      return;
    }

    setLoading(true);
    let urlLogin = "/api/auth/login"; // Por defecto para voluntario y admin
    if (tipoUsuario === "ong") {
      urlLogin = "/api/organizaciones/login";
    }

    try {
      const response = await fetch(urlLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.clear();
        localStorage.setItem("email", email);
        localStorage.setItem("isLogged", "true");

        let rolToSet = "USER";
        if (tipoUsuario === "ong") rolToSet = "ONG";
        if (tipoUsuario === "admin") rolToSet = "ADMIN";
        localStorage.setItem("rol", rolToSet);

        if (tipoUsuario === "voluntario" || tipoUsuario === "admin") {
          localStorage.setItem("usuarioId", data.id);
          localStorage.setItem("user", JSON.stringify(data));
          if (tipoUsuario === "admin") {
            window.location.href = "/admin/";
            return;
          }
        } else {
          const idCorrecto = data.idOrganizacion || data.id_organizacion || data.id;
          localStorage.setItem("ongId", idCorrecto);
        }
        window.location.href = "/";
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("No hay conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setError("");
    setExito("");

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidado(true);
      return;
    }

    setLoading(true);
    const urlRegistro = tipoUsuario === "voluntario" ? `/api/auth/register` : `/api/organizaciones/register`;
    const bodyData = tipoUsuario === "voluntario"
      ? { nombre: regNombre, apellido: regApellido, email: regEmail, password_hash: regPassword }
      : { nombreOrganizacion: regNombreOrg, email: regEmail, passwordHash: regPassword, telefono: regTelefono, sitioWeb: regSitioWeb, descripcion: regDescripcion };

    try {
      const response = await fetch(urlRegistro, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setExito("¡Registro completado exitosamente! Por favor, revisa tu correo.");
        emailjs.send("service_jde23sl", "template_thpbvke", {
          to_name: tipoUsuario === "voluntario" ? regNombre : regNombreOrg,
          user_email: regEmail,
          company_name: "Blue Crew",
        }, "XRltpFrVtfWnjbjMO").catch(() => { });

        setTimeout(() => {
          setIsLogin(true);
          setValidado(false);
        }, 2500);
      } else {
        const rawError = data.error || data.message || "";
        if (rawError.includes("Unique index") || rawError.includes("23505")) {
          setError("Este correo electrónico ya está registrado.");
        } else {
          setError("Error al procesar el registro. Inténtalo de nuevo.");
        }
      }
    } catch (err) {
      setError("Fallo en la conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-universal-wrapper container-fluid p-0 min-vh-100 d-flex align-items-center justify-content-center">
      <div className="bg-image" style={{ backgroundImage: `url(${fondoLogin})` }}></div>
      <div className="bg-overlay"></div>

      <Link to="/" className="position-absolute top-0 start-0 m-3 m-md-4 text-white text-decoration-none d-flex align-items-center gap-2 px-3 py-2 rounded-2 bg-dark bg-opacity-25 border border-white border-opacity-10" style={{ zIndex: 10 }}>
        <i className="bi bi-house-door fs-5"></i>
        <span className="fw-medium">Inicio</span>
      </Link>

      <div className="container" style={{ zIndex: 10 }}>
        <div className="row justify-content-center my-5">
          <div className={`col-12 ${!isLogin ? 'col-md-8 col-lg-6' : 'col-md-6 col-lg-5'}`}>
            <div className="card border-0 rounded-4 shadow-lg bg-white p-4 p-sm-5">

              <div className="text-center mb-4">
                <h1 className="display-6 fw-bold text-primary mb-2">BlueCrew</h1>
                <p className="text-secondary">
                  {isLogin ? "Bienvenido de nuevo, inicia sesión para continuar." : "Únete a nuestra comunidad y marca la diferencia."}
                </p>
              </div>

              <ul className="nav nav-pills nav-fill mb-4 p-1 rounded-3 bg-light">
                <li className="nav-item">
                  <button
                    className={`nav-link fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2 ${tipoUsuario === "voluntario" ? "active" : "text-secondary"}`}
                    onClick={() => { setTipoUsuario("voluntario"); setError(""); setExito(""); }}
                  >
                    <i className="bi bi-person"></i> Voluntario
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2 ${tipoUsuario === "ong" ? "active" : "text-secondary"}`}
                    onClick={() => { setTipoUsuario("ong"); setError(""); setExito(""); }}
                  >
                    <i className="bi bi-building"></i> ONG
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2 ${tipoUsuario === "admin" ? "active" : "text-secondary"}`}
                    onClick={() => { setTipoUsuario("admin"); setIsLogin(true); setError(""); setExito(""); }}
                  >
                    <i className="bi bi-shield-check"></i> Admin
                  </button>
                </li>
              </ul>

              <div className="card-body p-0">
                {error && <div className="alert alert-danger py-2 text-center" style={{ fontSize: '0.9rem' }}>{error}</div>}
                {exito && <div className="alert alert-success py-2 text-center" style={{ fontSize: '0.9rem' }}>{exito}</div>}

                {isLogin ? (
                  <form className={`needs-validation ${validado ? 'was-validated' : ''}`} noValidate onSubmit={handleLogin}>
                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 text-secondary"><i className="bi bi-envelope"></i></span>
                        <input type="email" className="form-control bg-light border-start-0 ps-0" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <div className="invalid-feedback">Ingresa un correo electrónico válido.</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 text-secondary"><i className="bi bi-lock"></i></span>
                        <input type="password" className="form-control bg-light border-start-0 ps-0" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <div className="invalid-feedback">Ingresa tu contraseña.</div>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 rounded-3 py-2 fw-bold text-white" disabled={loading}>
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Iniciando...</>
                      ) : "Iniciar Sesión"}
                    </button>
                  </form>
                ) : (
                  tipoUsuario !== "admin" ? (
                    <form className={`needs-validation ${validado ? 'was-validated' : ''}`} noValidate onSubmit={handleRegistro}>
                      {tipoUsuario === "voluntario" ? (
                        <div className="row g-3 mb-3">
                          <div className="col-12 col-sm-6">
                            <div className="input-group">
                              <span className="input-group-text bg-light border-end-0 text-secondary"><i className="bi bi-person"></i></span>
                              <input type="text" className="form-control bg-light border-start-0 ps-0" placeholder="Nombre" value={regNombre} onChange={(e) => setRegNombre(e.target.value)} required />
                            </div>
                          </div>
                          <div className="col-12 col-sm-6">
                            <div className="input-group">
                              <span className="input-group-text bg-light border-end-0 text-secondary"><i className="bi bi-person"></i></span>
                              <input type="text" className="form-control bg-light border-start-0 ps-0" placeholder="Apellido" value={regApellido} onChange={(e) => setRegApellido(e.target.value)} required />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="mb-3">
                            <div className="input-group">
                              <span className="input-group-text bg-light border-end-0 text-secondary"><i className="bi bi-building"></i></span>
                              <input type="text" className="form-control bg-light border-start-0 ps-0" placeholder="Nombre Organización" value={regNombreOrg} onChange={(e) => setRegNombreOrg(e.target.value)} required />
                            </div>
                          </div>
                          <div className="row g-3 mb-3">
                            <div className="col-12 col-sm-6">
                              <div className="input-group">
                                <span className="input-group-text bg-light border-end-0 text-secondary"><i className="bi bi-telephone"></i></span>
                                <input type="text" className="form-control bg-light border-start-0 ps-0" placeholder="Teléfono" value={regTelefono} onChange={(e) => setRegTelefono(e.target.value)} required />
                              </div>
                            </div>
                            <div className="col-12 col-sm-6">
                              <div className="input-group">
                                <span className="input-group-text bg-light border-end-0 text-secondary"><i className="bi bi-globe"></i></span>
                                <input type="url" className="form-control bg-light border-start-0 ps-0" placeholder="Sitio Web (opcional)" value={regSitioWeb} onChange={(e) => setRegSitioWeb(e.target.value)} />
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="mb-3">
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0 text-secondary"><i className="bi bi-envelope"></i></span>
                          <input type="email" className="form-control bg-light border-start-0 ps-0" placeholder="Correo electrónico" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                          <div className="invalid-feedback">Ingresa un correo electrónico válido.</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0 text-secondary"><i className="bi bi-lock"></i></span>
                          <input type="password" className="form-control bg-light border-start-0 ps-0" placeholder="Contraseña (Mín. 6)" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required minLength="6" />
                          <div className="invalid-feedback">La contraseña debe tener al menos 6 caracteres.</div>
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary w-100 rounded-3 py-2 fw-bold text-white" disabled={loading}>
                        {loading ? (
                          <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Registrando...</>
                        ) : "Crear Cuenta"}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center p-4 bg-light rounded-3 border border-secondary border-opacity-25 border-dashed">
                      <i className="bi bi-shield-check text-secondary mb-3 opacity-50" style={{ fontSize: '48px' }}></i>
                      <p className="text-secondary mb-0 fw-medium">El registro de administradores no está disponible públicamente.</p>
                    </div>
                  )
                )}
              </div>

              {tipoUsuario !== "admin" && (
                <div className="text-center mt-4">
                  <p className="text-secondary mb-0">
                    {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                    <button className="btn btn-link p-0 text-primary fw-semibold text-decoration-none" onClick={toggleForm}>
                      {isLogin ? "Regístrate aquí" : "Inicia sesión"}
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
