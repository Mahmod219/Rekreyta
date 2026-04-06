"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { createContext, useState, useContext, useEffect } from "react";
import { createPortal } from "react-dom";

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

// ... (بقية الكود بالأعلى كما هو)

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation(); // هذا السطر هو مفتاح الحل
        open(opensWindowName);
      }}
      className="contents"
    >
      {children}
    </div>
  );
}

function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const [mounted, setMounted] = useState(false);

  // 1. التأكد من أننا في المتصفح (Client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. التحكم في السكرول بناءً على فتح المودال
  useEffect(() => {
    // نتحقق إذا كان هذا المودال تحديداً هو المفتوح
    const isThisModalOpen = openName === name;

    if (isThisModalOpen) {
      document.body.style.overflow = "hidden";
    }

    // هذه هي دالة الـ Cleanup (تنفذ عند الـ Unmount أو قبل تشغيل الـ Effect مرة أخرى)
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openName, name]); // يعتمد على حالة الفتح

  // إذا لم يتم التركيب بعد أو لم يكن هذا المودال هو المطلوب، لا ترسم شيئاً
  if (!mounted || openName !== name) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 backdrop"
      // منع أي mousedown أو click من الوصول إلى أي استماع للنقرات خارج الدروب داون
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        className="absolute top-1 right-2 p-2 rounded-full bg-gray-50 font-bold hover:bg-gray-100 z-999"
      >
        <XMarkIcon className="h-6 w-6 text-gray-500 " />
      </button>
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        onMouseDown={(e) => e.stopPropagation()}
      />

      <div
        className="relative bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl z-50 overflow-hidden"
        // نكرر منع الانتشار هنا للتأكيد على المحتوى الداخلي (الأزرار)
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
// المكون الذي كان ينقصك وتسبب بالخطأ
function Close({ children }) {
  const { close } = useContext(ModalContext);

  return (
    <div onClick={close} className="contents">
      {children}
    </div>
  );
}

// ربط المكونات الفرعية (Sub-components)
Modal.Open = Open;
Modal.Window = Window;
Modal.Close = Close;

export default Modal;
