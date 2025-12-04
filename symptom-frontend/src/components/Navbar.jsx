export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-brand-blue text-white font-bold w-10 h-10 rounded-full flex items-center justify-center">
            <span className="text-xl">λ</span>
          </div>
          <span className="text-xl font-semibold text-gray-800">MediCheck</span>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-gray-600 font-medium">
          <a href="/" className="hover:text-brand-blue">
            Home
          </a>
          <a href="/how" className="hover:text-brand-blue">
            How it Works
          </a>
          <a href="/conditions" className="hover:text-brand-blue">
            Conditions
          </a>
        </div>

        {/* CTA */}
        <a
          href="/check"
          className="bg-brand-blue text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition"
        >
          Start Check
        </a>
      </div>
    </nav>
  );
}
