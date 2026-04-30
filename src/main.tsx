import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import AppWrapper from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider value={defaultSystem}>
        <AppWrapper />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
);
