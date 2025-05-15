import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export const InputField = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <ThemedView style={{ gap: 4 }}>
      <ThemedText>{title}</ThemedText>
      {children}
    </ThemedView>
  );
};
