import { Routes, Route, Outlet } from "react-router-dom";
import "./App.scss";
import Navbar from "./components/common/nav/Nav";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import Contacto from "./pages/Contacto";
import MisEventos from "./pages/MisEventos";
import Participaciones from "./pages/Participaciones";
import UserProfile from "./components/sections/UserProfile";
import Privacidad from "./pages/Privacidad";
import DetalleEvento from "./pages/Evento";
import Eventos from "./pages/Eventos";
import { useState, useEffect, useCallback } from "react";
import clienteAxios from "./config/axios";
import { formatearFechaHora } from "./utilities/formatearFechaHora";
import Cookies from "./pages/Cookies";
import AvisoLegal from "./pages/AvisoLegal";
import Noticias from "./pages/Noticias";
import Noticia from "./pages/Noticia";
import CrearEvento from "./pages/CrearEvento";
// import Login from "./pages/Login/LoginRegistro";
import Login from "./pages/Login/LoginUniversal";
import SobreNosotros from "./pages/SobreNosotros";
import PagOng from "./pages/Ong";
import CalificarEvento from "./components/forms/CalificarEvento/CalificarEvento";

const MainLayout = ({ refrescarEventos }) => {
  return (
    <>
      <Navbar />
      <Outlet context={{ refrescarEventos }} />
      <Footer />
    </>
  );
};

function App() {
  const [datos, setDatos] = useState([]);

  const obtenerDatos = useCallback(async () => {
    try {
      let response;
      const usuarioId = localStorage.getItem("usuarioId");

      if (!usuarioId) {
        response = await clienteAxios.get("/eventos/activos");
      } else {
        response = await clienteAxios.get("/eventos/activos/" + usuarioId);
      }

      const eventosFormateados = response.data.map((item) => {
        const { fecha, hora } = formatearFechaHora(item[4]);
        return {
          id: item[0],
          titulo: item[1],
          imagen: item[2],
          descripcionEvento: item[3],
          fechaOriginal: new Date(item[4]),
          fechaDisplay: fecha,
          horaDisplay: hora,
          categoria: item[5],
          descripcionCategoria: item[6],
          material: item[7],
          ubicacion: item[8],
          participantes: item[9],
        };
      });

      setDatos(eventosFormateados);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("logout") === "true") {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    } else {
      obtenerDatos();
    }
  }, [obtenerDatos]);
  return (
    <div className="d-flex flex-column min-vh-100">
      <Routes>
        <Route element={<MainLayout refrescarEventos={obtenerDatos} />}>
          <Route path="/" element={<Home datos={datos} />} />
          <Route path="/mis-eventos" element={<MisEventos />} />
          <Route path="/participaciones" element={<Participaciones />} />
          <Route path="/perfil" element={<UserProfile />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/eventos" element={<Eventos datos={datos} />} />
          <Route path="/eventos/:id" element={<DetalleEvento />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/aviso-legal" element={<AvisoLegal />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticias/:id" element={<Noticia />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/eventos/crear" element={<CrearEvento />} />
          <Route path="/ong" element={<PagOng />} />
          <Route
            path="/participaciones/calificar-evento/:id"
            element={<CalificarEvento />}
          />
          <Route
            path="*"
            element={
              <h1 className="text-center my-5">404 - Página no encontrada</h1>
            }
          />
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
