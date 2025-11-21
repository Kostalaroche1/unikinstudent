import "bootstrap/dist/css/bootstrap.min.css"
import "./globals.css";
import SessionWrappers from "@/session/SessionWrappers";
import { ContextProvide } from "@/Component/ContextComponent/UserAuth";
import BootstrapInstallation from "@/Component/Bootstrap";
import FooterBiblos from "@/Component/HeavyComponent/FooterBilblos";

export default function RootLayout({ children }) {


  return (
    <ContextProvide>
      <SessionWrappers>
        <html lang="en">
          <BootstrapInstallation />
          <body >
            <div className="page-container">
              <main className="content">{children}</main>
              <FooterBiblos />
            </div>
          </body>
        </html>
      </SessionWrappers>
    </ContextProvide >
  );
}
