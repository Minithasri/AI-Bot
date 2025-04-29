import { Notyf } from "notyf";
import "notyf/notyf.min.css"; // for React, Vue and Svelte
import "./custom-notyf.css";
// Create an instance of Notyf
const notyf = new Notyf({
  duration: 5000,
  position: {
    x: "right",
    y: "top",
  },
  ripple: false,
  types: [
    {
      type: "success",
      background: "#ffffff",
      icon: {
        className: "notyf__icon--success",
        tagName: "i",
      },
    },
    {
      type: "error",
      background: "#ffffff",
      icon: {
        className: "notyf__icon--error",
        tagName: "i",
      },
    },
  ],
});

export const errorToast = (msg: string) => {
  notyf.error(msg);
};

export const successToast = (msg: string) => {
  notyf.success(msg);
};
