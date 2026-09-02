import { useEffect, useMemo, useState } from 'react'
import { fetchImages } from '../services/api'

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
]

function Galeria({ estaLogeado = false, imagenes = imagenesPorDefecto }: GaleriaProps) {
	const [items, setItems] = useState<ImagenGaleria[]>(imagenes)
	const [cargando, setCargando] = useState(false)
	const [modoSeleccion, setModoSeleccion] = useState(false)
	const [seleccionadas, setSeleccionadas] = useState<Set<string>>(new Set())
	const [visorIndex, setVisorIndex] = useState<number | null>(null)

	const haySeleccion = seleccionadas.size > 0

	const idsSeleccionados = useMemo(() => Array.from(seleccionadas), [seleccionadas])

	// Navegación por imagen completa se realiza dentro del visor modal

	const abrirSeleccion = () => {
		setModoSeleccion(true)
		setSeleccionadas(new Set())
	}

	const cerrarSeleccion = () => {
		setModoSeleccion(false)
		setSeleccionadas(new Set())
	}

	useEffect(() => {
		let mounted = true
		const cargar = async () => {
			setCargando(true)
			try {
				const data = await fetchImages()
				if (!mounted) return

				// Esperamos que el backend devuelva un array de { id, url, alt }
				if (Array.isArray(data)) {
					const imgs = data.map((it: any) => ({ id: it.id || it.url, src: it.url || it.src, alt: it.alt || '' }))
					setItems((prev) => [...imgs, ...prev])
				}
			} catch (e) {
				// Silencioso — la UI seguirá mostrando imágenes por defecto
				console.warn('No se pudieron cargar imágenes desde backend', e)
			} finally {
				setCargando(false)
			}
		}

		cargar()

		return () => {
			mounted = false
		}
	}, [])

	// If parent provides `imagenes` prop updates, merge them at the top
	useEffect(() => {
		setItems((prev) => {
			// avoid duplicates by id
			const existingIds = new Set(prev.map(i => i.id))
			const nuevos = imagenes.filter(i => !existingIds.has(i.id))
			if (nuevos.length === 0) return prev
			return [...nuevos, ...prev]
		})
	}, [imagenes])

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
		if (!haySeleccion) return

		const confirmado = window.confirm('Seguro/a que quieres borrar las imagenes?')
		if (!confirmado) return

		const siguientes = items.filter((item) => !seleccionadas.has(item.id))
		setItems(siguientes)
		setSeleccionadas(new Set())

		if (siguientes.length === 0) {
			setVisorIndex(null)
			setModoSeleccion(false)
			return
		}

		setVisorIndex((prev) => {
			if (prev === null) return null
			return Math.min(prev, siguientes.length - 1)
		})
	}

	const cerrarVisor = () => setVisorIndex(null)

	const moverVisor = (direccion: number) => {
		if (items.length === 0 || visorIndex === null) return

		setVisorIndex((prev) => {
			if (prev === null) return null
			return (prev + direccion + items.length) % items.length
		})
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

											setVisorIndex(index)
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

					{/* Se muestra el grid; la vista ampliada se abre en un modal al hacer click en la miniatura */}
				</>
			) : (
				<div className="rounded-2xl border border-dashed border-[#cfbf9d] bg-[#fffdf8] p-8 text-center text-[#6f5528]">
					No hay imagenes disponibles.
				</div>
			)}

			{visorIndex !== null && (
				<div className="fixed inset-0 z-60 flex items-center justify-center p-6">
					<div className="absolute inset-0 bg-black/60" onClick={cerrarVisor} />
					<div className="relative z-10 mx-auto max-w-4xl max-h-[90vh] overflow-auto rounded-lg bg-white p-4">
						<button
							type="button"
							onClick={cerrarVisor}
							aria-label="Cerrar visor"
							className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#5e4a25] shadow hover:bg-gray-50"
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>

						<div className="flex items-center justify-between gap-3">
							<button
								type="button"
								onClick={() => moverVisor(-1)}
								className="rounded-full border border-[#cdb57f] bg-white px-3 py-1 text-sm font-semibold text-[#6f5528] transition hover:bg-[#faf4e3]"
							>
								‹
							</button>
							<div className="mx-4 max-h-[80vh] overflow-auto">
								<img src={items[visorIndex].src} alt={items[visorIndex].alt} className="max-h-[80vh] w-auto" />
							</div>
							<button
								type="button"
								onClick={() => moverVisor(1)}
								className="rounded-full border border-[#cdb57f] bg-white px-3 py-1 text-sm font-semibold text-[#6f5528] transition hover:bg-[#faf4e3]"
							>
								›
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Uploader embebido eliminado: la subida se abre desde el botón SUBIR FOTOS */}
		</section>
	)
}

export default Galeria
