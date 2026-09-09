export default function ChatPage() {
  return (
    <div className="w-full h-full overflow-y-auto font-intert">
      <div className="px-4 sm:px-10 lg:px-16 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-instrument text-primary tracking-tight">
          Chat
        </h1>
        <p className="text-sm text-muted font-intert mt-1 max-w-lg">
          Ask about sea conditions, fishing zones, or departure safety. Every
          answer cites the IMD bulletin or INCOIS advisory behind it.
        </p>
      </div>
    </div>
  );
}
