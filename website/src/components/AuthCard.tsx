export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="card mx-auto w-full max-w-md p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}
