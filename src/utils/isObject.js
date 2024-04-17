export const isObject = (data) => {
    try {
      if (typeof data === "object") {
        return true;
      } 
        return false;
      
    } catch (error) {
      return false;
    }
  };
  