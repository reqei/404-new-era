import "./globals.css";
import Header from "./Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
       <Header />

        <main className="w-full max-w-[1000px] mx-auto px-6">
          {children}
        </main>
      </body>
    </html>
  );
}