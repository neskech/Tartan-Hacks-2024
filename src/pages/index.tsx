import styles from "src/styles/style.module.css";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { Inter } from "next/font/google";

import DisplayCard from "~/components/DisplayCard";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`${inter.className} bg-gray-50 text-gray-950`}>
      <div className={styles.homebody}>
        <div className={styles.center_div}>
          <div className={styles.cards_scroll}>
            <DisplayCard />
            <DisplayCard />
            <DisplayCard />
            <DisplayCard />
            <DisplayCard />
            <DisplayCard />
            <DisplayCard />
            <DisplayCard />
          </div>
          <Form className={styles.form_style}>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Example textarea</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </div>
      </div>
    </main>
  );
}
