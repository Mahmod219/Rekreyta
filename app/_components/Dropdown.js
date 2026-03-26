"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const DropdownContext = createContext();

export default function Dropdown({ children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

Dropdown.Toggle = function Toggle({ children }) {
  const { setOpen } = useContext(DropdownContext);
  return <div onClick={() => setOpen((o) => !o)}>{children}</div>;
};

Dropdown.Menu = function Menu({ children }) {
  const { open } = useContext(DropdownContext);
  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-40 bg-primary-50 shadow-2xl rounded-2xl  z-50">
      {children}
    </div>
  );
};

Dropdown.Item = function Item({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className=" px-4 py-2 text-left w-full hover:bg-primary-100 cursor-pointer  "
    >
      {children}
    </button>
  );
};
