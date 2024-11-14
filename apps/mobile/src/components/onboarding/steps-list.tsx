import { Text } from "react-native";

import Step1OnboardingWelcome from "./step-screens/step-1-onboarding-welcome";
import Step2OnboardingBirthdate from "./step-screens/step-2-onboarding-birthdate";
import Step3PhoneNumber from "./step-screens/step-3-onboarding-phone";

interface OnboardingStep {
  order: number;
  description: string;
  component: JSX.Element;
}
export const onboardingSteps: OnboardingStep[] = [
  {
    order: 1,
    description: "Onboarding welcome",
    component: <Step1OnboardingWelcome />,
  },
  {
    order: 2,
    description: "Date of birth",
    component: <Step2OnboardingBirthdate />,
  },
  {
    order: 3,
    description: "Phone number",
    component: <Step3PhoneNumber />,
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
