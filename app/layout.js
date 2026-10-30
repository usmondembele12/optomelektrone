import "./globals.css";

export const metadata = {
  title: "OPTOM ELEKTRO — Elektr jihozlari va kabellarning ulgurji savdo markazi",
  description: "Toshkent va O'zbekiston bo'ylab avtomat uzgichlar, quvvat kabellari, shchitlar, kontaktorlar va barcha turdagi elektr mahsulotlari ulgurji (optom) va arzon narxlarda.",
  icons: {
    icon: "/images/logo.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}
