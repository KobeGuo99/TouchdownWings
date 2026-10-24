import { renderToString } from "react-dom/server";
import App from "../src/App";

export default function render() {
  return renderToString(<App />);
}
