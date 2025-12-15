export function SiteFooter() {
  return (
    <footer className="border-t bg-white" style={{ borderColor: 'rgb(var(--border))' }}>
      <div className="container-app py-8 text-sm text-slate-600">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <div className="font-medium text-slate-900">Authrix</div>
            <div>Multi-tenant authentication as a service. Self-hostable.</div>
          </div>
          <div className="text-slate-500">© {new Date().getFullYear()} Authrix</div>
        </div>
      </div>
    </footer>
  );
}
