import "bootstrap/dist/css/bootstrap.min.css"
import "./globals.css";
import SessionWrappers from "@/session/SessionWrappers";
import { ContextProvide } from "@/Component/ContextComponent/UserAuth";
import BootstrapInstallation from "@/Component/Bootstrap";
import FooterBiblos from "@/Component/HeavyComponent/FooterBilblos";
import Script from "next/script";

export default function RootLayout({ children }) {


  return (
    <ContextProvide>
      <SessionWrappers>
        <html lang="en">
          <BootstrapInstallation />
          <head>
            <Script id="first id"
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-62NKTG0X9C"
            />
            <Script id="second id"
              dangerouslySetInnerHTML={{
                __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-62NKTG0X9C');
      `,
              }}
            />
          </head>

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
