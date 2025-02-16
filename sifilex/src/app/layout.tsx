import { Metadata } from "next";
import localFont from "next/font/local";
import './styles/globals.css';
import './styles/atoms.css';
import './styles/molecules.css';
import './styles/organisms.css';
import './styles/templates.css';
import 'antd/dist/antd.css'; 
import SessionWrapper from "@/app/lib/providers/SessionWrapper";
import { EdgeStoreProvider } from "../lib/edgestore";

// Importation de la police
const apfelGrotezk = localFont({
  src: [
    {
      path: "../../public/fonts/ApfelGrotezk-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ApfelGrotezk-Mittel.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/ApfelGrotezk-Fett.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/ApfelGrotezk-Satt.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-apfel-grotezk",
});

export { apfelGrotezk };

export const metadata: Metadata = {
  title: "SiFilex",
  description: "Gérer vos fichiers en toute sécurité",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <SessionWrapper>
        <body className={`${apfelGrotezk.variable}`}>
          <EdgeStoreProvider>
            {children}
          </EdgeStoreProvider>
        </body>
      </SessionWrapper>
    </html>
  );
}
