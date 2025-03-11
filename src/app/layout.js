import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { isAuthEnabled } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Confidi App",
  description: "Confidi application with authentication",
};

export default function RootLayout({ children }) {
  // Renderiza el AuthProvider solo si la autenticación está habilitada
  if (isAuthEnabled) {
    return (
      <html lang="en">
        <body suppressHydrationWarning={true} className={inter.className}>
          <AuthProvider>{children}</AuthProvider>
        </body>
      </html>
    );
  }

  // Si la autenticación está deshabilitada, no use el AuthProvider
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
