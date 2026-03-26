"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { createContext, useState, useContext } from "react";

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens = "default" }) {
  const { open } = useContext(ModalContext);

  return (
    <div onClick={() => open(opens)} className="contents">
      {children}
    </div>
  );
}

function Window({ children, name = "default" }) {
  const { openName, close } = useContext(ModalContext);

  if (openName !== name) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl">
        <button
          onClick={close}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function Close({ children }) {
  const { close } = useContext(ModalContext);

  return (
    <div onClick={close} className="contents">
      {children}
    </div>
  );
}

// Attach subcomponents to Modal
Modal.Open = Open;
Modal.Window = Window;
Modal.Close = Close;

export default Modal;
