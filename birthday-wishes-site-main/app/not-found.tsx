export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg text-[#5B2347] flex items-center justify-center px-6">
      <div className="max-w-xl rounded-[2rem] border border-white/10 bg-card p-10 text-center shadow-glow">
        <p className="text-sm uppercase tracking-[0.4em] text-[#D6488F] mb-4">Page not found</p>
        <h1 className="text-4xl font-semibold mb-4">This chapter is missing.</h1>
        <p className="text-[#6B2247]/80 leading-8">The story still continues—head back to the home screen and start from the beginning.</p>
      </div>
    </div>
  )
}
