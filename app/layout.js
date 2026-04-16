import { Inter } from "next/font/google";

import "@/app/_styles/globals.css";

import { Toaster } from "sonner";
import { AuthProvider } from "./_components/SessionProvider";

import CookieBanner from "./_components/CookieBanner";
import Header from "./_components/ui/Header";
import Footer from "./_components/ui/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    template: "%s | Rekreyta",
    default: "Rekreyta - Hitta lediga jobb i Sverige",
  },
  description:
    "Rekreyta är den moderna plattformen för att hitta ditt nästa jobb i Sverige. Enkel ansökan och de bästa karriärmöjligheterna.",
  keywords: [
    "jobb",
    "lediga tjänster",
    "karriär",
    "rekrytering",
    "Sverige",
    "Rekreyta",
    "arbete",
  ],
  authors: [{ name: "Rekreyta Team" }],
  creator: "Rekreyta",
  metadataBase: new URL("https://rekreyta.se"), // رابط موقعك المستقبلي

  openGraph: {
    title: "Rekreyta - Din väg till ett nytt jobb",
    description: "Hitta de senaste lediga tjänsterna i Sverige på Rekreyta.",
    url: "https://rekreyta.se",
    siteName: "Rekreyta",
    locale: "sv_SE", // مهم جداً لجوجل السويدي
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rekreyta - Hitta jobb i Sverige",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
// export const metadata = {
//   // title: "The Wild Oasis",
//   title: {
//     template: "%s / Rekryta",
//     default: "Welcome / Rekryta",
//   },
//   description:
//     "Rekryta is a modern job board where companies can post job openings and candidates can discover new career opportunities.",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="sv" className={inter.className}>
      <body className=" bg-gray-50  min-h-screen flex flex-col antialiased relative scroll-smooth overflow-x-hidden">
        <AuthProvider>
          <Header />

          {/* أزلنا الـ grid هنا واستبدلناه بـ flex-1 بسيط */}
          <div className="flex-1 w-full flex flex-col">
            {/* الـ main يجب أن يكون w-full بدون max-w هنا، لأن الـ Hero يحتاج عرض الشاشة كاملاً */}
            <main className="w-full relative">
              {children}
              <CookieBanner />
              <Toaster position="top-center" />
            </main>
          </div>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
