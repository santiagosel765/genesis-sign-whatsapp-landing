export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">
          Landing de WhatsApp
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Esta landing se usa para redirigir enlaces de firma enviados por
          WhatsApp.
        </p>
      </div>
    </main>
  );
}
