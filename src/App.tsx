/* eslint-disable prettier/prettier */
import React from "react";
import AllRoutes from "./routes/Routes";
import { configureFakeBackend } from "./helpers";
import { Toaster } from "react-hot-toast";
// styles
import "gridjs/dist/theme/mermaid.min.css";
import "./index.scss";

// configure fake backend
configureFakeBackend();

const App = () => {
  return (
    <React.Fragment>
      <Toaster position="bottom-right" />
      <AllRoutes />
    </React.Fragment>
  );
};

export default App;
