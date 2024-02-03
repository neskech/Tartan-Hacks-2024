import styles from "src/styles/style.module.css";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { Inter } from "next/font/google";

import DisplayCard from "~/components/DisplayCard";
import DarkNavbar from "~/components/Header";
import React, { ElementRef, Ref, SyntheticEvent, useState } from "react";
import { Button } from "react-bootstrap";

const inter = Inter({ subsets: ["latin"] });

//Form stolen from bootstrap docs
export default function Home() {
  const a = [
    {
      title: "Sample Title",
      text: "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. ",
    },
    {
      title: "Sample Title2",
      text: "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. ",
    },
    {
      title: "Sample Title3",
      text: "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. ",
    },
    {
      title: "Sample Title4",
      text: "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. ",
    },
    {
      title: "Sample Title5",
      text: "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. ",
    },
    {
      title: "Sample Title6",
      text: "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. ",
    },
  ];

  const [texts, updateTexts] = useState(a);

  const textareaRef: ElementRef<typeof Form> = React.createRef();


  return (
    <main className={`${inter.className} truncate bg-gray-50 text-gray-950`}>
      <DarkNavbar></DarkNavbar>
      <div className="h-[90vh] w-screen flex-row">
        <div className="w-screen px-32 ">
          <div className="border-1 my-4 h-[32rem] overflow-y-auto rounded-md bg-slate-50 p-1">
           
          </div>
          <Form
            onSubmit={submitTextHandler}
            className="border-1 relative top-[0vh] m-2 rounded-md p-2"
          >
            <Form.Group
              className="m-1"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control
                id="typing_box"
                as="textarea"
                rows={3}
                placeholder="Enter text here"
              />
              <Button className="mt-2" variant="primary" type="submit">
                Submit
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </main>
  );
}
