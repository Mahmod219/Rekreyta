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
  const { setOpen } = useContext(DropdownContext);

  return (
    <div
      onClick={(e) => {
        // إذا كان هناك onClick مررناه يدوياً نفذه وأغلق المنيو
        if (onClick) {
          onClick(e);
          setOpen(false);
        }
        // ملاحظة: لا نضع setOpen(false) هنا بشكل إجباري
        // لكي نسمح للمودال بالبقاء مفتوحاً
      }}
      className="px-4 py-2 text-left w-full hover:bg-gray-100 cursor-pointer transition-colors first:rounded-t-2xl last:rounded-b-2xl"
    >
      {children}
    </div>
  );
};
