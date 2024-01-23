import { useState, useEffect } from "react";

export function useScreen() {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // height and width of the canvas
    setHeight(window.innerHeight);
    setWidth(window.innerWidth);
    function handleResize() {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return { width, height };
}
