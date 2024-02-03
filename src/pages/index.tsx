import Head from "next/head";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <body className={`${inter.className}`}>
      <h1>Hello, world</h1>
    </body>
  );
}
