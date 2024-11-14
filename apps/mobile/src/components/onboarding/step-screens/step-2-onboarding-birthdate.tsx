import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useQuery } from "@apollo/client";

import { graphql } from "@grinn/graphql";

import { client } from "@/components/apollo";

const Step2OnboardingBirthdate = ({
  onValidate,
}: {
  onValidate?: (birthdate: Date) => void;
}) => {
  const [birthdate, setBirthdate] = useState(new Date(""));

  const { data: currentUser } = useQuery(CurrentUser, {
    fetchPolicy: "network-only",
  });

  const validateStep = async () => {
    await client.mutate({
      mutation: UpdateUser,
      variables: {
        id: currentUser?.currentUser?.id,
        patch: {
          birthdate: birthdate,
        },
      },
    });
    onValidate?.(birthdate);
  };

  //TODO props à passer dans le parent pour valider le stepView>
      <Text>Date de naissance</Text>
      <TextInput
        className="mb-6 mt-16 h-12 w-full rounded bg-white p-2"
        textContentType="birthdateYear"
        keyboardType="numeric"
        inputMode="numeric"
        placeholder="Année de naissance (AAAA)"
        onChangeText={(text) => setBirthdate(new Date(text))}
      />
    </View>
  );
};

const CurrentUser = graphql(`
  query currentUser {
    currentUser {
      id
      username
    }
  }
`);

const UpdateUser = graphql(`
  mutation updateUser($id: UUID!, $patch: UserPatch = {}) {
    updateUser(input: { id: $id, patch: $patch }) {
      clientMutationId
    }
  }
`);

export default Step2OnboardingBirthdate;
