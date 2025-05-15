import { useWindowDimensions } from "react-native";

const useIsWidthLessThan400 = () => {
  const { width } = useWindowDimensions();
  return width < 390;
};

export default useIsWidthLessThan400;
