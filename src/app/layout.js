import "./globals.css";

import { Providers } from "../components/Providers";

export const metadata = {
  title: "KostHub | Platform Pencarian Kos Terbaik",
  description: "Temukan kos-kosan terbaik, terdekat, dan termurah dengan mudah di KostHub.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
