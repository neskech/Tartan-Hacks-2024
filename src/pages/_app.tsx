import { type AppType } from "next/dist/shared/lib/utils";
import styles from "src/styles/style.module.css";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;
