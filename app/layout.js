import { AuthProvider } from "./_components/SessionProvider";
import { Inter } from "next/font/google";
import Header from "./_components/Header";
import "@/app/_styles/globals.css";
import { Toaster } from "sonner";
import Footer from "./_components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  // title: "The Wild Oasis",
  title: {
    template: "%s / Rekryta",
    default: "Welcome / Rekryta",
  },
  description:
    "Rekryta is a modern job board where companies can post job openings and candidates can discover new career opportunities.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body
        className=" text-primary-800
       bg-primary-50 min-h-screen flex flex-col antialiased relative scroll-smooth"
      >
        <AuthProvider>
          <Header />
          <div className="flex-1  grid ">
            <main className="max-w-7xl mx-auto w-full">
              {children}
              <Toaster position="top-center" />
            </main>
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
