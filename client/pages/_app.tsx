import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../public/css/styles.css";
import TopNav from "../components/TopNav";
import type { AppProps } from "next/app";
import { AuthContextProvider } from "../context/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <ToastContainer position="top-center" />
      <TopNav />
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default MyApp;
