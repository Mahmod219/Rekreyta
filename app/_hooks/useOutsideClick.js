import { useRef, useEffect } from "react";

function useOutsideClick(handler, listenCapturin = true) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          handler();
        }
      }
      document.addEventListener("click", handleClick, listenCapturin);
      return () =>
        document.removeEventListener("click", handleClick, listenCapturin);
    },
    [handler, listenCapturin],
  );
  return ref;
}

export default useOutsideClick;
