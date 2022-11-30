import React from "react";
import "react-day-picker/dist/style.css";

import { useEffect } from "react";
import * as ReactDOM from "react-dom";
import SearchBar from "./components/SearchBar";

const App = () => {
  useEffect(() => {
    // @ts-ignore
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.message === "TabUpdated") {
        replaceSearchBarInDOM();
      }
    });

    replaceSearchBarInDOM();
  }, []);

  const replaceSearchBarInDOM = () => {
    setTimeout(() => {
      const elements = document.querySelectorAll(
        '[aria-label="Search Twitter"]'
      );
      for (var i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLInputElement;
        element.innerHTML = "";
        const id = Math.random().toString();
        const d = document.createElement("div");
        d.id = id;
        element.appendChild(d);
        ReactDOM.render(<SearchBar />, document.getElementById(id));
      }
    }, 800);
  };

  return <></>;
};

export default App;
