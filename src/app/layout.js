import "bootstrap/dist/css/bootstrap.min.css"
import "./globals.css";
import SessionWrappers from "@/session/SessionWrappers";
import { ContextProvide } from "@/Component/ContextComponent/UserAuth";
import BootstrapInstallation from "@/Component/Bootstrap";

export default function RootLayout({ children }) {


  return (
    <ContextProvide>
      <SessionWrappers>
        <html lang="en">
          <BootstrapInstallation />
          <body >
            {children}
          </body>
        </html>
      </SessionWrappers>
    </ContextProvide >
  );
}
