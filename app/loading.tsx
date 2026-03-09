export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-[#00CFFF]/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-[#00CFFF] animate-spin" />
        </div>
        <span className="text-xs text-[#4D5E87] tracking-widest uppercase">Loading</span>
      </div>
    </div>
  )
}
