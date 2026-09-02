import './App.css'
import Botones from './componentes/Botones'
import FotoMainBoda from './componentes/FotoMainBoda'
import Nombres from './componentes/Nombres'

function App() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center px-4 py-5 md:px-8 md:py-8">
      <section className="w-full overflow-hidden rounded-[2rem] bg-white">
        <FotoMainBoda />
        <div className="px-6 pb-8 text-center md:px-10 md:pb-10">
          <Nombres />
          <Botones />
        </div>
      </section>
    </main>
  )
}

export default App