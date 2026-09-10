export default function AuditLogPage() {
  return (
    <div className="w-full h-full overflow-y-auto font-intert">
      <div className="px-4 sm:px-10 lg:px-16 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-instrument text-primary tracking-tight">
          Audit Log
        </h1>
        <p className="text-sm text-muted font-intert mt-1 max-w-lg">
          Every agent decision, tool call, and alert in a reviewable trail,
          including what happens when a data source fails.
        </p>
      </div>
    </div>
  );
}
