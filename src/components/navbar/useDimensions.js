import { useEffect, useRef } from "react";

export const useDimensions = ref => {
    const dimensions = useRef({ width: 0, height: 0 });
  
    useEffect(() => {
      if (ref.current !== null)
      {
        dimensions.current.width = ref.current.offsetWidth;
        dimensions.current.height = ref.current.offsetHeight;
      }
    }, []);
  
    return dimensions.current;
};