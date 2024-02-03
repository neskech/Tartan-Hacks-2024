import "bootstrap/dist/css/bootstrap.min.css";
import { Inter } from "next/font/google";
import DarkNavbar from "~/components/Header";
import CardStack from "~/components/CardStack";
import { motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`${inter.className} truncate bg-gray-50 text-gray-950`}>
        <DarkNavbar></DarkNavbar>
        <CardStack />
    </main>
  );
}
