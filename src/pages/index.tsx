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
    {title:"Sample Title", text:"Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. "}, 
    {title:"Sample Title2", text:"Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. "}, 
    {title:"Sample Title3", text:"Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. "}, 
    {title:"Sample Title4", text:"Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. "}, 
    {title:"Sample Title5", text:"Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. "}, 
    {title:"Sample Title6", text:"Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. "}, 
  
  ]
  
  const [texts, updateTexts] = useState(a) 

  const textareaRef:ElementRef<typeof Form> = React.createRef();

  function submitTextHandler(e:SyntheticEvent) {
    e.preventDefault()
    const text = document.getElementById("typing_box").value
    updateTexts(oldarray => [...oldarray, {title:"title", text: text}])
    console.log(texts, document.getElementById("typing_box"), text)
    document.getElementById("typing_box").value = ""
  }

  return (
    <main className={`${inter.className} bg-gray-50 text-gray-950 truncate`}>
    <DarkNavbar></DarkNavbar>
    <div className="w-screen h-[90vh] flex-row">
      <div className="w-screen px-32 ">
        <div className="border-1 p-1 my-4 h-[32rem] overflow-y-auto rounded-md bg-slate-50">
            {
              texts.map((boxObj, i) => <React.Fragment><DisplayCard key={i} title={boxObj.title} text={boxObj.text} /><hr className="m-2"></hr></React.Fragment>)
            }
        </div>
        <Form onSubmit={submitTextHandler} className="border-1 relative top-[0vh] rounded-md p-2 m-2">
          <Form.Group
            className="m-1"
            controlId="exampleForm.ControlTextarea1"
          >
            <Form.Control id="typing_box" as="textarea" rows={3} placeholder="Enter text here" />
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
