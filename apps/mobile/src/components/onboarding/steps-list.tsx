import { Text } from "react-native";

interface OnboardingStep {
  order: number;
  description: string;
  component: JSX.Element;
}
export const onboardingSteps: OnboardingStep[] = [
  {
    order: 1,
    description: "Onboarding welcome",
    component: <Text>Onboarding welcome</Text>,
  },
  {
    order: 2,
    description: "Date of birth",
    component: <Text>Date of birth</Text>,
  },
  {
    order: 3,
    description: "Phone number",
    component: <Text>Phone number</Text>,
  },
  {
    order: 4,
    description: "Phone verification code",
    component: <Text>Phone verification code</Text>,
  },

  {
    order: 5,
    description: "Localisation",
    component: <Text>Localisation</Text>,
  },
  {
    order: 6,
    description: "Notifications",
    component: <Text>Notifications</Text>,
  },
  {
    order: 7,
    description: "Congratulations",
    component: <Text>Congratulations</Text>,
  },
];
