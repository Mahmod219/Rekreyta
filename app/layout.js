import { Inter } from "next/font/google";

import "@/app/_styles/globals.css";

import { Toaster } from "sonner";
import { AuthProvider } from "./_components/SessionProvider";

import CookieBanner from "./_components/CookieBanner";
import Header from "./_components/ui/Header";
import Footer from "./_components/ui/Footer";
import AIButton from "./_components/ui/AIButton";
import { hasCvFile } from "./_lib/data-service";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    template: "%s | Rekreyta",
    default: "Rekreyta - AI-driven jobbmatchning i Sverige",
  },
  description:
    "Hitta ditt nästa jobb med hjälp av AI. Rekreyta matchar din kompetens med de bästa karriärmöjligheterna i Sverige genom avancerad smart teknik.",
  keywords: [
    "AI jobbmatchning", // كلمة مفتاحية قوية
    "jobb",
    "lediga tjänster",
    "karriär",
    "rekrytering Sverige",
    "Rekreyta",
    "smart rekrytering",
    "artificiell intelligens jobb",
  ],
  authors: [{ name: "Rekreyta Team" }],
  creator: "Rekreyta",
  metadataBase: new URL("https://rekreyta.vercel.app/"),

  openGraph: {
    title: "Rekreyta - Framtidens rekrytering med AI",
    description:
      "Låt vår AI hitta ditt nästa drömjobb. Upplev smartare jobbmatchning på Rekreyta.",
    url: "https://rekreyta.vercel.app/",
    siteName: "Rekreyta",
    locale: "sv_SE",
    type: "website",
    images: [
      {
        url: "/og-image.png", // تأكد من وضع صورة بهذا الاسم في مجلد public
        width: 1200,
        height: 630,
        alt: "Rekreyta - AI-driven jobbplattform",
      },
    ],
  },

  twitter: {
    // أضفت لك تويتر أيضاً لضمان ظهور الرابط بشكل جميل هناك
    card: "summary_large_image",
    title: "Rekreyta - AI-driven jobbmatchning",
    description: "Hitta jobb i Sverige smartare med AI.",
    images: ["/og-image.png"],
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

export default async function RootLayout({ children }) {
  return (
    <html lang="sv" className={inter.className}>
      <body className=" bg-gray-50  min-h-screen flex flex-col antialiased relative scroll-smooth overflow-x-hidden">
        <AuthProvider>
          <Header />

          {/* أزلنا الـ grid هنا واستبدلناه بـ flex-1 بسيط */}
          <div className="flex-1 w-full flex flex-col">
            {/* الـ main يجب أن يكون w-full بدون max-w هنا، لأن الـ Hero يحتاج عرض الشاشة كاملاً */}
            <main className="w-full relative">
              <AIButton />
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
