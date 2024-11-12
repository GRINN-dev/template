import { router } from "expo-router";
import { create } from "zustand";

import { onboardingSteps } from "./steps-list";

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
