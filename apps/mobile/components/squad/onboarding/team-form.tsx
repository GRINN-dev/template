import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import * as Contacts from "expo-contacts";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostHog } from "posthog-react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InputField } from "@/components/form/InputField";
import { ThemedView } from "@/components/ThemedView";
import { BaseButton } from "@/components/ui/base-button";
import { ContainerButtonSheet } from "@/components/ui/containerButtonSheet";
import { CurrentUserQuery } from "@/graphql/current-user";
import { SaveMyNewContacts } from "@/graphql/mutations/user";
import { GetFederUsersHasMePreRegistered } from "@/graphql/queries-content";
import { contactMapping } from "@/utils/utils";
import { ContactCard, SimpleContactType } from "../contact-card";

const nameSearchForm = z.object({
  nameSearch: z.string().optional(),
});

const contactBatchNumber = 20;
export const TeamFormOnboardingSquad = ({
  handleOnPressNext,
}: {
  handleOnPressNext: () => void;
}) => {
  const [contacts, setContacts] = useState<SimpleContactType[]>([]);
  const [visibleContacts, setVisibleContacts] = useState<SimpleContactType[]>(
    [],
  );
  const { data: currentUser } = useQuery(CurrentUserQuery);
  const [isScrolled, setIsScrolled] = useState(false);
  const [saveMyNewContacts] = useMutation(SaveMyNewContacts);
  const posthog = usePostHog();

  // récup des users qui ont enregistré mon numéro
  const { data: federContacts } = useQuery(GetFederUsersHasMePreRegistered, {
    variables: {
      phoneNumber: currentUser?.currentUser?.phoneNumber ?? "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(nameSearchForm),
  });

  const mappMobileContacts = (data: Contacts.Contact[]) => {
    const mappedContacts = data
      .filter((dc) => dc?.id)
      .map((contact) => contactMapping(contact));
    const completeMappedContacts = mappedContacts
      ?.filter((mc) => mc?.firstname && mc?.osRepertoryPhoneNumber && mc?.id)
      .map((c: SimpleContactType) => {
        const federContact = federContacts?.preRegisteredContacts?.nodes?.find(
          (fc) => fc?.inviter?.phoneNumber === c.osRepertoryPhoneNumber,
        );
        return {
          ...c,
          hasMeInTeam: federContact?.inviter ? true : false,
        };
      });
    return completeMappedContacts;
    // setContacts(completeMappedContacts);
    // setVisibleContacts(completeMappedContacts);
  };

  const loadContacts = async (searchName?: string) => {
    const { data } = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.Emails,
        Contacts.Fields.PhoneNumbers,
        Contacts.Fields.LastName,
        Contacts.Fields.FirstName,
      ],
      sort: Contacts.SortTypes.LastName,
      ...(searchName ? { name: searchName } : {}),
    });
    return mappMobileContacts(data);
  };

  const firstLoadContacts = async () => {
    const myContacts = await loadContacts();
    setContacts(myContacts);
    setVisibleContacts(myContacts);
  };

  useEffect(() => {
    firstLoadContacts();
  }, []);

  const clickItem = (contact: SimpleContactType) => {
    const newContacts = contacts.map((c) => {
      if (c.id === contact.id) {
        return { ...c, isSelected: !c.isSelected };
      }
      return c;
    });
    setContacts(newContacts);
    const newVisibleContacts = visibleContacts.map((c) => {
      if (c.id === contact.id) {
        return { ...c, isSelected: !c.isSelected };
      }
      return c;
    });
    setVisibleContacts(newVisibleContacts);
  };

  const handleOnPress = async () => {
    // make real contacts with ones already on feder and pre_regesiterd with others
    if (contacts?.filter((c) => c.isSelected)?.[0])
      await saveMyNewContacts({
        variables: {
          input: {
            contacts:
              contacts
                .filter((c) => c.isSelected)
                .map((c) => ({
                  osPhoneNumber: c.osRepertoryPhoneNumber ?? "",
                  firstname: c.firstname ?? "",
                  lastname: c.lastname ?? "",
                })) ?? [],
          },
        },
      });
    posthog?.capture("contacts_first_import", {
      description: "Importation de contacts",
      properties: { nombre: contacts?.filter((c) => c.isSelected)?.length },
      tags: ["équipe", "Nombre", "Haute"],
      type: "event",
    });
    handleOnPressNext();
  };

  const submitSearch = async (data: any) => {
    const filterdcontacts = contacts.filter((contact) => {
      const name = contact?.firstname + " " + contact?.lastname;
      return name.toLowerCase().includes(data?.nameSearch?.toLowerCase() ?? "");
    });
    setVisibleContacts(filterdcontacts);
  };

  return (
    <ThemedView className="grow">
      <View className="flex-1 px-4">
        {isScrolled && (
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "transparent"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              zIndex: 1,
            }}
          />
        )}
        <InputField
          name="nameSearch"
          control={control}
          title=""
          type="text"
          placeHolder="Recherche"
          errors={JSON.stringify(errors?.nameSearch?.message)}
          submitOnChange
          onSubmitEditing={handleSubmit(submitSearch)}
        />
        {contacts?.[0] ? null : (
          <View className="w-full justify-center py-8">
            <ActivityIndicator />
          </View>
        )}
        <FlatList
          data={visibleContacts}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 16,
              }}
            />
          )}
          onScroll={({ nativeEvent }) => {
            setIsScrolled(nativeEvent.contentOffset.y > 100);
          }}
          scrollEventThrottle={16}
          keyExtractor={(item) =>
            item?.id ?? item?.osRepertoryPhoneNumber ?? ""
          }
          initialNumToRender={contactBatchNumber} // Rendre d'abord 20 éléments
          maxToRenderPerBatch={contactBatchNumber} // Limiter le nombre d'éléments rendus à chaque batch
          renderItem={({ item }) => (
            <ContactCard
              key={item?.id}
              contact={item}
              onPress={() => clickItem(item)}
              withSelection
            />
          )}
        />
      </View>
      <View className="absolute bottom-0 z-10 w-full">
        <ContainerButtonSheet shadow title="Sélectionnez vos coéquipiers">
          {contacts?.find((c) => c.isSelected)?.id ? (
            <BaseButton
              title="Ajouter la sélection"
              type="solid"
              onPress={handleOnPress}
            />
          ) : (
            <BaseButton
              title="Suivant"
              type="outlined"
              onPress={handleOnPress}
            />
          )}
        </ContainerButtonSheet>
      </View>
    </ThemedView>
  );
};
