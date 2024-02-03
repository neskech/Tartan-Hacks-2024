import "bootstrap/dist/css/bootstrap.min.css";
import { Inter } from "next/font/google";
import DarkNavbar from "~/components/Header";
import CardStack from "~/components/CardStack";
import { motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`${inter.className} truncate bg-gray-50 text-gray-950`}>
      <motion.div
        initial={{ opacity: 0, y: -300 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeIn" }}
      >
        <DarkNavbar></DarkNavbar>
        <CardStack />
      </motion.div>
    </main>
  );
}
