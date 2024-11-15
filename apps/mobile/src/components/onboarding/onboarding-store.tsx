import { router } from "expo-router";
import { create } from "zustand";

// import { graphql } from "@grinn/graphql";

// import { client } from "../apollo";
import { onboardingSteps } from "./steps-list";

// import { useQuery } from "@apollo/client";

const initialState = {
  step: 1,
};

export const useOnboardingStore = create<{
  step: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
}>((set) => ({
  ...initialState,
  setStep: (step: number) => set({ step }),
  reset: () => set(initialState),
  nextStep: () =>
    set((state) => {
      if (state?.step === onboardingSteps?.length) {
        router.push("/(home)");
        return state;
      }
      return { step: state?.step + 1 };
    }),
  previousStep: () =>
    set((state) => {
      if (state?.step === 1) {
        router.push("/(auth)/login");
        return state;
      }
      return { step: state?.step - 1 };
    }),
}));

// const UpdateUser = graphql(`
//   mutation updateUser($id: UUID!, $patch: UserPatch = {}) {
//     updateUser(input: { id: $id, patch: $patch }) {
//       clientMutationId
//     }
//   }
// `);

// const CurrentUser = graphql(`
//   query currentUser {
//     currentUser {
//       id
//       username
//     }
//   }
// `);
