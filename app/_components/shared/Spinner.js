export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-[#2ecc91]/10 rounded-full"></div>

        <div className="absolute inset-0 border-4 border-t-[#2ecc91] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-[#2d2e3e] font-bold text-sm tracking-widest animate-pulse uppercase">
        Loading...
      </p>
    </div>
  );
}
