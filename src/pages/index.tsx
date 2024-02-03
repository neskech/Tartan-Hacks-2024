import styles from "src/styles/style.module.css";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { Inter } from "next/font/google";

import DisplayCard from "~/components/DisplayCard";
import DarkNavbar from "~/components/Header";
import React, { ElementRef, Ref, SyntheticEvent, useState } from "react";
import { Button } from "react-bootstrap";
import CardStack from "~/components/CardStack";

const inter = Inter({ subsets: ["latin"] });


export default function Home() {
  return (
    <main className={`${inter.className} truncate bg-gray-50 text-gray-950`}>
      <DarkNavbar></DarkNavbar>
      <CardStack />
    </main>
  );
}
