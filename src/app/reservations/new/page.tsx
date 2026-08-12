const steps = [
  "Elige qué quieres comer",
  "Selecciona una opción",
  "Define cuándo",
  "Guarda tu reserva",
];

const menuModes = [
  {
    title: "Menú curado",
    description: "5 o 6 opciones estables para reservar sin fricción.",
  },
  {
    title: "Menú personalizable",
    description: "Construcción paso a paso para quien quiere explorar.",
  },
];

export default function NewReservationPage() {
  return (
    <main className="min-h-screen bg-[#fbf7f1] text-zinc-950">
      <div className="mx-auto min-h-screen w-full max-w-5xl px-6 py-8">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
              MomEat
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              Crear borrador de reserva.
            </p>
          </div>

          <nav className="flex flex-wrap gap-2 text-sm">
            <a
              href="/discover"
              className="rounded-full border border-zinc-300 px-4 py-2 transition hover:border-zinc-950"
            >
              Volver a descubrir
            </a>
            <a
              href="/"
              className="rounded-full bg-zinc-950 px-4 py-2 font-medium text-white transition hover:bg-zinc-800"
            >
              Inicio
            </a>
          </nav>
        </header>

        <section className="grid flex-1 gap-10 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Draft reservation
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Crea una reserva antes de confirmar.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-zinc-600">
              En esta fase MomEat todavía no procesa pagos ni operaciones
              irreversibles. El usuario arma su intención de compra y la deja
              lista para confirmación posterior.
            </p>

            <div className="rounded-[2rem] border border-zinc-200 bg-white p-6">
              <p className="text-sm font-medium text-zinc-500">
                Pasos del borrador
              </p>
              <ol className="mt-4 space-y-3 text-sm text-zinc-700">
                {steps.map((step, index) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950 text-white">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="space-y-4">
            {menuModes.map((mode) => (
              <article
                key={mode.title}
                className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-2xl font-semibold">{mode.title}</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-600">
                  {mode.description}
                </p>
              </article>
            ))}

            <div className="rounded-[2rem] border border-zinc-200 bg-zinc-950 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
                Estado
              </p>
              <p className="mt-3 text-2xl font-semibold">draft</p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                La reserva todavía no está confirmada. No hay pago ni operación
                irreversible.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
