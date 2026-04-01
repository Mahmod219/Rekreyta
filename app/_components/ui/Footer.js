import Link from "next/link";
import Image from "next/image";

import logo from "@/public/logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#2d2e3e] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Column 1: Logo & About */}
        <div className="space-y-6">
          <Image
            src={logo}
            alt="Rekreyta Logo"
            width={140}
            height={40}
            className="brightness-200"
          />
          <p className="text-gray-400 text-sm leading-relaxed">
            Connecting global talent with Sweden's most innovative companies.
            Your future starts here.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 text-[#2ecc91]">Quick Links</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li>
              <Link href="/jobs" className="hover:text-white transition-colors">
                Find Jobs
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/#services"
                className="hover:text-white transition-colors"
              >
                Our Services
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 text-[#2ecc91]">Support</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li>
              <Link href="/faq" className="hover:text-white transition-colors">
                FAQs
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 text-[#2ecc91]">
            Stay Updated
          </h4>
          <p className="text-sm text-gray-400 mb-4">
            Subscribe to get the latest job alerts.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-[#2ecc91]"
            />
            <button className="bg-[#2ecc91] text-[#2d2e3e] px-4 py-2 rounded-lg font-bold text-sm hover:bg-white transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Rekreyta. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer">LinkedIn</span>
          <span className="hover:text-white cursor-pointer">Twitter</span>
          <span className="hover:text-white cursor-pointer">Instagram</span>
        </div>
      </div>
    </footer>
  );
}
