import { useState } from 'react'
import './App.css'
import Botones from './componentes/Botones'
import FotoMainBoda from './componentes/FotoMainBoda'
import Galeria from './componentes/Galeria'
import Nombres from './componentes/Nombres'
import SubirImagenes from './componentes/SubirImagenes'
import InicioSesion from './componentes/InicioSesion'
import Perfil from './componentes/Perfil'

function App() {
  const [adminLogeado, setAdminLogeado] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem('auth_token'))
    } catch (e) {
      return false
    }
  })
  const [galeriaAbierta, setGaleriaAbierta] = useState(false)

  const abrirGaleria = () => setGaleriaAbierta(true)
  const cerrarGaleria = () => setGaleriaAbierta(false)

  
  const [loginAbierto, setLoginAbierto] = useState(false)

  const abrirLogin = () => setLoginAbierto(true)
  const cerrarLogin = () => setLoginAbierto(false)
  const [perfilAbierto, setPerfilAbierto] = useState(false)
  const abrirPerfil = () => setPerfilAbierto(true)
  const cerrarPerfil = () => setPerfilAbierto(false)
  const [subirAbierto, setSubirAbierto] = useState(false)

  const abrirSubir = () => setSubirAbierto(true)
  const cerrarSubir = () => setSubirAbierto(false)
  const [transientImagenes, setTransientImagenes] = useState<any[]>([])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center px-4 py-5 md:px-8 md:py-8">
      <section className="w-full overflow-hidden rounded-[2rem] bg-white">
        <FotoMainBoda />
        <div className="px-6 pb-8 text-center md:px-10 md:pb-10">
          <Nombres />
          <Botones
            onSubirFotosClick={abrirSubir}
            onVerGaleriaClick={abrirGaleria}
            onAdminLoginClick={() => {
              const token = localStorage.getItem('auth_token')
              if (token) {
                abrirPerfil()
              } else {
                abrirLogin()
              }
            }}
          />
        </div>
      </section>

      {galeriaAbierta && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div className="absolute inset-0 bg-black/50" onClick={cerrarGaleria} />
          <div className="relative z-10 w-full max-w-6xl max-h-[90vh] overflow-auto rounded-2xl bg-white p-6 shadow-lg">
            <button
              type="button"
              onClick={cerrarGaleria}
              aria-label="Cerrar galería"
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#5e4a25] shadow hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            <Galeria estaLogeado={adminLogeado} imagenes={transientImagenes.length ? transientImagenes : undefined} />
          </div>
        </div>
      )}

      {subirAbierto && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60" onClick={cerrarSubir} />
          <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg">
            <button
              type="button"
              onClick={cerrarSubir}
              aria-label="Cerrar subir"
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#5e4a25] shadow hover:bg-gray-50"
            >
              ✕
            </button>

            <h3 className="mb-4 text-xl font-semibold text-[#8f6d35]">Subir imagenes</h3>
            <SubirImagenes
              multiple
              showActions
              onUploaded={(results) => {
                // Map uploaded results into gallery items and prepend to Galeria by opening it
                const nuevas = results.map((r: any, i: number) => ({
                  id: r.response?.image?.filename || r.filename || r.fileName || `user-${Date.now()}-${i}`,
                  src: r.url || r.preview || (r.response?.image?.path ? `${r.response.image.path}` : `/uploads/${r.fileName}`),
                  alt: r.response?.image?.originalName || r.response?.alt || r.fileName,
                }))

                // close uploader and open gallery to show new images
                cerrarSubir()
                setGaleriaAbierta(true)
                // pass nuevas into Galeria via the `imagenes` prop by setting a transient state
                setTransientImagenes(nuevas)
              }}
            />
          </div>
        </div>
      )}

        {loginAbierto && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60" onClick={cerrarLogin} />
            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
              <button
                type="button"
                onClick={cerrarLogin}
                aria-label="Cerrar login"
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#5e4a25] shadow hover:bg-gray-50"
              >
                ✕
              </button>

              <h3 className="mb-4 text-xl font-semibold text-[#8f6d35]">Iniciar sesión (Admin)</h3>
              <InicioSesion
                onSuccess={() => {
                  // marcar admin como logeado y cerrar modal
                  setAdminLogeado(true)
                  cerrarLogin()
                }}
              />
            </div>
          </div>
        )}
        {perfilAbierto && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60" onClick={cerrarPerfil} />
            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
              <button
                type="button"
                onClick={cerrarPerfil}
                aria-label="Cerrar perfil"
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#5e4a25] shadow hover:bg-gray-50"
              >
                ✕
              </button>

              <Perfil
                onClose={() => {
                  cerrarPerfil()
                }}
                onLogout={() => {
                  // limpiar session
                  localStorage.removeItem('auth_token')
                  localStorage.removeItem('auth_user')
                  setAdminLogeado(false)
                  cerrarPerfil()
                }}
              />
            </div>
          </div>
        )}
    </main>
  )
}

export default App