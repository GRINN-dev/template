import { Text } from "react-native";

// import { graphql } from "@grinn/graphql";
// import { client } from "@/components/apollo";
import Step1OnboardingWelcome from "./step-screens/step-1-onboarding-welcome";
import Step2OnboardingBirthdate from "./step-screens/step-2-onboarding-birthdate";
import Step3PhoneNumber from "./step-screens/step-3-onboarding-phone";
import Step4OnboardingVerifyCode from "./step-screens/step-4-onboarding-verify-code";

interface OnboardingStep {
  order: number;
  description: string;
  component: JSX.Element;
}

export const onboardingSteps: OnboardingStep[] = [
  {
    order: 1,
    description: "Onboarding welcome",
    component: <Step1OnboardingWelcome props={{ buttonIsFixed: true }} />,
  },
  {
    order: 2,
    description: "Date of birth",
    component: <Step2OnboardingBirthdate props={{ buttonIsFixed: true }} />,
    // onValidate: async (
    //   currentUserId: string,
    //   userPatch: { birthdate: Date },
    // ) => {
    //   await client.mutate({
    //     mutation: UpdateUser,
    //     variables: {
    //       id: currentUserId,
    //       patch: {
    //         birthday: userPatch.birthdate,
    //       },
    //     },
    //   });
    // },
  },
  {
    order: 3,
    description: "Phone number",
    component: (
      <Step3PhoneNumber
        props={{
          buttonIsFixed: true,
        }}
      />
    ),
  },
  {
    order: 4,
    description: "Phone verification code",
    component: (
      <Step4OnboardingVerifyCode
        props={{
          buttonIsFixed: true,
        }}
      />
    ),
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

// const UpdateUser = graphql(`
//   mutation updateUser($id: UUID!, $patch: UserPatch = {}) {
//     updateUser(input: { id: $id, patch: $patch }) {
//       clientMutationId
//     }
//   }
// `);
