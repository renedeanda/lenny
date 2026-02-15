export default function ExploreLoading() {
  return (
    <main className="min-h-screen bg-void text-ash font-mono flex items-center justify-center">
      <div className="text-center">
        <div className="text-amber text-2xl font-bold animate-pulse mb-2">LOADING</div>
        <div className="text-ash-dark text-sm">Fetching episodes...</div>
      </div>
    </main>
  );
}
