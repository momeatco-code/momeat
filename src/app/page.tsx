const quickPath = [
  "Ver opciones curadas",
  "Elegir rápido",
  "Reservar y seguir",
];

const discoveryPath = [
  "Explorar categorías",
  "Armar el menú",
  "Descubrir nuevos puntos",
];

const categories = [
  "Brunch",
  "Clásico",
  "Fitness",
  "Vegetariano",
  "Chef choice",
  "Comfort food",
];

const steps = [
  {
    title: "Descubre",
    text: "La plataforma guía al usuario sin saturarlo con demasiadas opciones al mismo tiempo.",
  },
  {
    title: "Elige",
    text: "Dos velocidades: una ruta rápida y una ruta de exploración gamificada.",
  },
  {
    title: "Reserva",
    text: "La experiencia termina en una reserva clara, sin pagos ni operaciones irreversibles todavía.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbf7f1] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
              MomEat
            </p>
            <p className="mt-2 max-w-xl text-sm text-zinc-600">
              Reservas programadas de alimentación. Una experiencia limpia,
              visual y guiada.
            </p>
          </div>

          <nav className="flex flex-wrap gap-2 text-sm">
            <a
              href="#caminos"
              className="rounded-full border border-zinc-300 px-4 py-2 transition hover:border-zinc-950"
            >
              Caminos
            </a>
            <a
              href="#categorias"
              className="rounded-full border border-zinc-300 px-4 py-2 transition hover:border-zinc-950"
            >
              Categorías
            </a>
            <a
              href="#como-funciona"
              className="rounded-full bg-zinc-950 px-4 py-2 font-medium text-white transition hover:bg-zinc-800"
            >
              Empezar
            </a>
          </nav>
        </header>

        <section className="grid flex-1 gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
              Foundation ready for the first product flow
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
                Reserva tu comida.
                <span className="block text-zinc-500">Sin saturación.</span>
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-zinc-600">
                MomEat guía al usuario entre menús curados y menús
                personalizables, con una experiencia progresiva pensada para
                explorar rápido o reservar rápido.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#caminos"
                className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Explorar la experiencia
              </a>
              <a
                href="#categorias"
                className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium transition hover:border-zinc-950"
              >
                Ver categorías
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-zinc-500">Modo</p>
                <p className="mt-2 text-lg font-semibold">Exploración</p>
                <p className="mt-2 text-sm text-zinc-600">
                  Guía visual con decisiones progresivas.
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-zinc-500">Modo</p>
                <p className="mt-2 text-lg font-semibold">Ruta rápida</p>
                <p className="mt-2 text-sm text-zinc-600">
                  Reservar en pocos pasos, sin fricción.
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-zinc-500">Estado</p>
                <p className="mt-2 text-lg font-semibold">MVP base</p>
                <p className="mt-2 text-sm text-zinc-600">
                  Sin pagos ni operaciones financieras todavía.
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="rounded-[1.5rem] bg-zinc-950 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
                MomEat flow
              </p>
              <h2 className="mt-4 text-2xl font-semibold">
                Dos rutas, una sola decisión final
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                El usuario puede avanzar rápido si ya sabe lo que quiere, o
                recorrer una experiencia gamificada si desea descubrir.
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl bg-amber-50 p-5">
                <p className="text-sm font-medium text-amber-900">Ruta rápida</p>
                <ul className="mt-3 space-y-2 text-sm text-amber-950">
                  {quickPath.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-amber-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl bg-zinc-100 p-5">
                <p className="text-sm font-medium text-zinc-900">
                  Ruta exploración
                </p>
                <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                  {discoveryPath.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-zinc-900" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </section>

        <section id="caminos" className="border-t border-zinc-200 py-16">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                Camino 01
              </p>
              <h3 className="mt-3 text-2xl font-semibold">Ruta rápida</h3>
              <p className="mt-3 max-w-xl text-zinc-600">
                Para usuarios que solo quieren resolver. Entrar, elegir,
                reservar, salir.
              </p>
            </div>

            <div className="rounded-[2rem] border border-zinc-200 bg-white p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                Camino 02
              </p>
              <h3 className="mt-3 text-2xl font-semibold">Ruta exploración</h3>
              <p className="mt-3 max-w-xl text-zinc-600">
                Para usuarios que disfrutan descubrir, comparar y personalizar
                antes de reservar.
              </p>
            </div>
          </div>
        </section>

        <section id="categorias" className="border-t border-zinc-200 py-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                Categorías
              </p>
              <h3 className="mt-3 text-3xl font-semibold">
                La experiencia empieza por lo que provoca.
              </h3>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category}
                className="rounded-3xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium"
              >
                {category}
              </div>
            ))}
          </div>
        </section>

        <section id="como-funciona" className="border-t border-zinc-200 py-16">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            Cómo funciona
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[2rem] border border-zinc-200 bg-white p-8"
              >
                <p className="text-sm font-medium text-zinc-500">
                  Paso {index + 1}
                </p>
                <h3 className="mt-3 text-2xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-zinc-200 py-16">
          <div className="rounded-[2rem] bg-zinc-950 px-8 py-10 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
              MomEat
            </p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h3 className="text-3xl font-semibold">
                  Una experiencia clara para descubrir y reservar.
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
                  La foundation ya está lista. Ahora el producto empieza a tomar
                  forma sobre una interfaz real.
                </p>
              </div>

              <a
                href="#top"
                className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
              >
                Volver arriba
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}