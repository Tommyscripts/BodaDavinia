import { useMemo, useState } from 'react'
import heroImage from '../assets/hero.png'

type ImagenGaleria = {
	id: string
	src: string
	alt: string
}

type GaleriaProps = {
	estaLogeado?: boolean
	imagenes?: ImagenGaleria[]
}

const imagenesPorDefecto: ImagenGaleria[] = [
	{ id: 'boda-1', src: '/boda1.jpg', alt: 'Davinia y Emeterio en su boda' },
	{ id: 'hero-1', src: heroImage, alt: 'Imagen principal de portada' },
]

function Galeria({ estaLogeado = false, imagenes = imagenesPorDefecto }: GaleriaProps) {
	const [items, setItems] = useState<ImagenGaleria[]>(imagenes)
	const [indiceActivo, setIndiceActivo] = useState(0)
	const [modoSeleccion, setModoSeleccion] = useState(false)
	const [seleccionadas, setSeleccionadas] = useState<Set<string>>(new Set())

	const haySeleccion = seleccionadas.size > 0
	const imagenActual = items[indiceActivo]

	const idsSeleccionados = useMemo(() => Array.from(seleccionadas), [seleccionadas])

	const mover = (direccion: number) => {
		if (items.length === 0) {
			return
		}

		setIndiceActivo((prev) => (prev + direccion + items.length) % items.length)
	}

	const abrirSeleccion = () => {
		setModoSeleccion(true)
		setSeleccionadas(new Set())
	}

	const cerrarSeleccion = () => {
		setModoSeleccion(false)
		setSeleccionadas(new Set())
	}

	const toggleSeleccion = (id: string) => {
		setSeleccionadas((prev) => {
			const nuevo = new Set(prev)

			if (nuevo.has(id)) {
				nuevo.delete(id)
			} else {
				nuevo.add(id)
			}

			return nuevo
		})
	}

	const descargarSeleccion = () => {
		const elementos = items.filter((item) => idsSeleccionados.includes(item.id))

		elementos.forEach((item) => {
			const enlace = document.createElement('a')
			enlace.href = item.src
			enlace.download = `${item.id}.jpg`
			document.body.appendChild(enlace)
			enlace.click()
			document.body.removeChild(enlace)
		})
	}

	const borrarSeleccion = () => {
		if (!haySeleccion) {
			return
		}

		const confirmado = window.confirm('Seguro/a que quieres borrar las imagenes?')

		if (!confirmado) {
			return
		}

		const siguientes = items.filter((item) => !seleccionadas.has(item.id))
		setItems(siguientes)
		setSeleccionadas(new Set())

		if (siguientes.length === 0) {
			setIndiceActivo(0)
			setModoSeleccion(false)
			return
		}

		setIndiceActivo((prev) => Math.min(prev, siguientes.length - 1))
	}

	return (
		<section className="mt-10 w-full">
			<div className="mb-5 flex items-center justify-between gap-3">
				<h2 className="font-serif text-3xl font-semibold text-[#8f6d35] md:text-4xl">Album de Recuerdos: D&amp;E</h2>

				{estaLogeado && (
					<div className="flex flex-wrap items-center justify-end gap-2">
						{!modoSeleccion ? (
							<button
								type="button"
								onClick={abrirSeleccion}
								className="rounded-full border border-[#d4c39d] bg-[#fffdf4] px-4 py-1.5 text-sm font-semibold text-[#6f5528] transition hover:bg-[#f7f1df]"
							>
								Seleccionar
							</button>
						) : (
							<>
								<button
									type="button"
									onClick={descargarSeleccion}
									disabled={!haySeleccion}
									className="rounded-full border border-[#ba9e67] bg-[#b99243] px-4 py-1.5 text-sm font-semibold text-[#fff8e8] transition enabled:hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
								>
									Descargar
								</button>
								<button
									type="button"
									onClick={borrarSeleccion}
									disabled={!haySeleccion}
									className="rounded-full border border-[#d4b2a4] bg-[#b95f41] px-4 py-1.5 text-sm font-semibold text-white transition enabled:hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
								>
									Borrar
								</button>
								<button
									type="button"
									onClick={cerrarSeleccion}
									className="rounded-full border border-[#d4c39d] bg-[#fffdf4] px-4 py-1.5 text-sm font-semibold text-[#6f5528] transition hover:bg-[#f7f1df]"
								>
									Cancelar
								</button>
							</>
						)}
					</div>
				)}
			</div>

			{items.length > 0 ? (
				<>
					<div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{items.map((imagen, index) => {
							const marcada = seleccionadas.has(imagen.id)

							return (
								<article
									key={imagen.id}
									className="group relative overflow-hidden rounded-2xl border border-[#e8ddc7] bg-white shadow-[0_6px_20px_rgba(54,40,16,0.10)]"
								>
									<button
										type="button"
										onClick={() => {
											if (modoSeleccion) {
												toggleSeleccion(imagen.id)
												return
											}

											setIndiceActivo(index)
										}}
										className="relative block w-full"
									>
										<img src={imagen.src} alt={imagen.alt} className="h-60 w-full object-cover" />
										{modoSeleccion && (
											<span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/75 bg-black/45 text-sm text-white">
												{marcada ? 'x' : ''}
											</span>
										)}
										{marcada && <span className="absolute inset-0 bg-[#9f782f]/30" />}
									</button>
								</article>
							)
						})}
					</div>

					<div className="rounded-2xl border border-[#e8ddc7] bg-[#fffdf7] p-4 shadow-[0_8px_22px_rgba(60,42,13,0.10)]">
						<div className="flex items-center justify-between gap-3">
							<button
								type="button"
								onClick={() => mover(-1)}
								className="rounded-full border border-[#cdb57f] bg-white px-4 py-2 text-sm font-semibold text-[#6f5528] transition hover:bg-[#faf4e3]"
							>
								Anterior
							</button>
							<p className="text-sm font-medium text-[#5e4a25]">
								{items.length > 0 ? indiceActivo + 1 : 0} / {items.length}
							</p>
							<button
								type="button"
								onClick={() => mover(1)}
								className="rounded-full border border-[#cdb57f] bg-white px-4 py-2 text-sm font-semibold text-[#6f5528] transition hover:bg-[#faf4e3]"
							>
								Siguiente
							</button>
						</div>
						{imagenActual && (
							<img
								src={imagenActual.src}
								alt={imagenActual.alt}
								className="mt-4 h-[28rem] w-full rounded-xl object-cover object-center"
							/>
						)}
					</div>
				</>
			) : (
				<div className="rounded-2xl border border-dashed border-[#cfbf9d] bg-[#fffdf8] p-8 text-center text-[#6f5528]">
					No hay imagenes disponibles.
				</div>
			)}
		</section>
	)
}

export default Galeria
