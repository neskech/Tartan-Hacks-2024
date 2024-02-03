import styles from "src/styles/style.module.css";
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  return (
  <div className={styles.homebody}>
    <div className={styles.padding}></div>
    <div className={styles.center_div}>
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Example textarea</Form.Label>
        <Form.Control as="textarea" rows={3} />
      </Form.Group>
    </Form>
    </div>
    <div className={styles.padding}></div>
  </div>
  )
}