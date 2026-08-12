const discoveryTracks = [
  {
    title: "Ruta rápida",
    description: "Para quien ya sabe lo que quiere y solo necesita reservar.",
    items: ["Ver opciones curadas", "Elegir rápido", "Reservar y seguir"],
  },
  {
    title: "Ruta exploración",
    description:
      "Para quien quiere descubrir categorías, comparar y personalizar.",
    items: ["Explorar categorías", "Armar el menú", "Descubrir nuevos puntos"],
  },
];

const categories = [
  "Desayuno",
  "Almuerzo",
  "Cena",
  "Brunch",
  "Fitness",
  "Comfort food",
];

const nextSteps = [
  {
    step: "01",
    title: "Elige tu camino",
    text: "MomEat distingue entre quien quiere resolver y quien quiere descubrir.",
  },
  {
    step: "02",
    title: "Construye tu reserva",
    text: "El usuario puede avanzar hacia un borrador antes de confirmar.",
  },
  {
    step: "03",
    title: "Confirma después",
    text: "Todavía no hay pagos ni operaciones irreversibles en esta fase.",
  },
];

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-[#fbf7f1] text-zinc-950">
      <div className="mx-auto min-h-screen w-full max-w-6xl px-6 py-8">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
              MomEat
            </p>
            <p className="mt-2 max-w-xl text-sm text-zinc-600">
              Descubre, compara o reserva rápido. Una experiencia guiada y
              limpia.
            </p>
          </div>

          <nav className="flex flex-wrap gap-2 text-sm">
            <a
              href="/"
              className="rounded-full border border-zinc-300 px-4 py-2 transition hover:border-zinc-950"
            >
              Inicio
            </a>
            <a
              href="/reservations/new"
              className="rounded-full bg-zinc-950 px-4 py-2 font-medium text-white transition hover:bg-zinc-800"
            >
              Crear borrador
            </a>
          </nav>
        </header>

        <section className="grid flex-1 gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
                Discovery
              </p>

              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
                MomEat guía al usuario sin saturarlo.
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-zinc-600">
                Dos velocidades, una misma meta: descubrir comida, personalizar
                si hace falta y llegar a una reserva clara.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {discoveryTracks.map((track) => (
                <section
                  key={track.title}
                  className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                    {track.title}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold">{track.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">
                    {track.description}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                    {track.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-amber-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="rounded-[2rem] border border-zinc-200 bg-white p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                Categorías iniciales
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="rounded-3xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm font-medium"
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="rounded-[1.5rem] bg-zinc-950 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
                Flujo
              </p>
              <h2 className="mt-4 text-2xl font-semibold">
                De descubrir a reservar
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                El objetivo de esta pantalla es que el usuario entienda que
                puede avanzar rápido o personalizar sin ruido.
              </p>
            </div>

            {nextSteps.map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5"
              >
                <p className="text-sm font-medium text-zinc-500">{item.step}</p>
                <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-600">
                  {item.text}
                </p>
              </div>
            ))}

            <a
              href="/reservations/new"
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Crear borrador de reserva
            </a>
          </aside>
        </section>
      </div>
    </main>
  );
}
