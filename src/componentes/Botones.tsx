type BotonesProps = {
	onSubirFotosClick?: () => void
	onVerGaleriaClick?: () => void
	onAdminLoginClick?: () => void
}


function Botones({ onSubirFotosClick, onVerGaleriaClick, onAdminLoginClick }: BotonesProps) {
	const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

	const handleSubirFotos = () => {
		if (onSubirFotosClick) {
			onSubirFotosClick()
			return
		}

		// Placeholder temporal: no existe backend para subida de fotos.
		console.info('Subir fotos estara disponible cuando exista backend.')
	}

	const handleVerGaleria = () => {
		if (onVerGaleriaClick) {
			onVerGaleriaClick()
			return
		}

		// Placeholder temporal: la galeria aun no esta creada.
		console.info('La galeria estara disponible cuando el componente exista.')
	}

	const handleAdminLogin = () => {
		// Si ya existe sesion, abrir perfil en lugar de login
		const token = localStorage.getItem('auth_token')
		if (token) {
			// si se proporcionó callback, dejar que el padre maneje abrir perfil
			if (onAdminLoginClick) {
				onAdminLoginClick()
				return
			}
			return
		}
		if (onAdminLoginClick) {
			onAdminLoginClick()
			return
		}

		console.info('El acceso admin estara disponible cuando se cree autenticacion.')
	}

	return (
		<div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8 md:gap-6">
			<button
				type="button"
				onClick={handleSubirFotos}
				className="inline-flex items-center gap-2 rounded-full border border-[#8d6e32] bg-gradient-to-b from-[#c59c54] to-[#9f782f] px-6 py-2 text-sm font-semibold tracking-wide text-[#fff8e7] shadow-[0_6px_16px_rgba(80,55,17,0.24)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b78d47] focus-visible:ring-offset-2"
			>
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					className="h-4 w-4"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H8l1.2-1.5h5.6L16 5h2.5A2.5 2.5 0 0 1 21 7.5v9A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z" />
					<circle cx="12" cy="12" r="3" />
				</svg>
				SUBIR FOTOS
			</button>

			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={handleVerGaleria}
					className="text-sm font-medium text-[#7b5c26] underline underline-offset-2 transition hover:text-[#5e4318]"
				>
					[ Ver Galeria ]
				</button>

				<button
					type="button"
					onClick={handleAdminLogin}
					className="relative -top-1 inline-flex items-center gap-2 rounded-full border border-[#d5c39a] bg-gradient-to-b from-[#fffdf4] to-[#efe6d3] px-4 py-1.5 font-serif text-base font-semibold text-[#8f7746] shadow-[0_5px_12px_rgba(78,59,24,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(78,59,24,0.26)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bfa46b] focus-visible:ring-offset-2"
				>
					{token ? 'Mi perfil' : 'Iniciar sesion (Admin)'}
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						className="h-6 w-6 text-[#b89a64]"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.8"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M12 19V6" />
						<path d="M12 8.5c1.7 0 2.9-1 3.8-2.2" />
						<path d="M12 11.3c1.6 0 2.7-.9 3.5-2" />
						<path d="M12 14.1c1.4 0 2.4-.8 3.1-1.7" />
						<path d="M12 8.5c-1.7 0-2.9-1-3.8-2.2" />
						<path d="M12 11.3c-1.6 0-2.7-.9-3.5-2" />
						<path d="M12 14.1c-1.4 0-2.4-.8-3.1-1.7" />
					</svg>
				</button>
			</div>
		</div>
	)
}

export default Botones
