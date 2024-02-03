import styles from "src/styles/style.module.css";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { Inter } from "next/font/google";

import DisplayCard from "~/components/DisplayCard";
import DarkNavbar from "~/components/Header";

const inter = Inter({ subsets: ["latin"] });

const sampleText = "Sample text for the card";
const sampleTitle = "Sample Title";

//Form stolen from bootstrap docs
export default function Home() {
  return (
    <main className={`${inter.className} bg-gray-50 text-gray-950`}>
      <DarkNavbar></DarkNavbar>
      <div className="w-screen flex-row">
        <div className="w-screen px-32 ">
          <div className="border-1 my-4 h-[32rem] overflow-y-auto rounded-md bg-slate-50">
            <DisplayCard title={sampleTitle} text={sampleText} />
            <DisplayCard title={sampleTitle} text={sampleText} />
            <DisplayCard title={sampleTitle} text={sampleText} />
            <DisplayCard title={sampleTitle} text={sampleText} />
            <DisplayCard title={sampleTitle} text={sampleText} />
            <DisplayCard title={sampleTitle} text={sampleText} />
            <DisplayCard title={sampleTitle} text={sampleText} />
            <DisplayCard title={sampleTitle} text={sampleText} />
            <DisplayCard title={sampleTitle} text={sampleText} />
            <DisplayCard title={sampleTitle} text={sampleText} />
          </div>
          <Form className="border-1 relative top-[0vh] rounded-md p-4">
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Enter text here</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </div>
      </div>
    </main>
  );
}
