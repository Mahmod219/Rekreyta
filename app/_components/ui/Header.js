import Logo from "./Logo";
import Navigation from "./Navigation";

export default async function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 lg:px-6 lg:py-4 transition-all ">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="hover:scale-105 transition-transform duration-300 scale-90 lg:scale-100">
          <Logo />
        </div>

        <Navigation />
      </div>
    </header>
  );
}
