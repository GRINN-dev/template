import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import * as Contacts from "expo-contacts";
import { LinearGradient } from "expo-linear-gradient";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ThemedView } from "@/components/ThemedView";
import { BaseButton } from "@/components/ui/base-button";
import { ContainerButtonSheet } from "@/components/ui/containerButtonSheet";
import { colorSlate50 } from "@/constants/ColorsFeder";
import { CurrentUserQuery } from "@/graphql/current-user";
import { SaveMyNewContacts } from "@/graphql/mutations/user";
import {
  CheckExistingPhoneContact,
  GetContactsFederByPhoneNumber,
} from "@/graphql/queries-content";
import { contactMapping } from "@/utils/utils";
import { InputField } from "../form/InputField";
import { EmptyComponentList } from "../ui/empty-component-list";
import { ContactCard, SimpleContactType } from "./contact-card";

const nameSearchForm = z.object({
  nameSearch: z.string().optional(),
});

export const ContactListFederAndPhone = ({
  onPress,
}: {
  onPress: () => void;
}) => {
  const [contacts, setContacts] = useState<SimpleContactType[]>([]);

  const [isScrolled, setIsScrolled] = useState(false);
  const [saveMyNewContacts] = useMutation(SaveMyNewContacts);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(nameSearchForm),
  });

  // Récupération des utilisateurs de l'application qui sont dans mon répertoire
  const [getContactsFederByPhoneNumber, { refetch: refetchContact }] =
    useLazyQuery(GetContactsFederByPhoneNumber);

  const [checkExistingPhoneContact, { refetch }] = useLazyQuery(
    CheckExistingPhoneContact,
  );

  const { data: currentUser } = useQuery(CurrentUserQuery);

  const loadContacts = async ({
    currentUser,
    searchName,
  }: {
    currentUser: any;
    searchName?: string;
  }) => {
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
    const mappedContacts = data
      .filter((dc) => dc?.id)
      .map((contact) => contactMapping(contact));
    const resExistingPhoneContact = await checkExistingPhoneContact({
      variables: {
        phoneNumbers: mappedContacts.map((c) => c.osRepertoryPhoneNumber ?? ""),
      },
      fetchPolicy: "network-only",
    });

    const res = await getContactsFederByPhoneNumber({
      variables: {
        pPhoneNumbersList: mappedContacts.map((c) => c.osRepertoryPhoneNumber!),
        currentUserId: currentUser?.id ?? "",
      },
      fetchPolicy: "network-only",
    });

    const completeMappedContacts = mappedContacts
      ?.filter((mc) => mc?.lastname && mc?.osRepertoryPhoneNumber && mc?.id)
      .filter(
        (contact) =>
          !resExistingPhoneContact.data?.chechExistingPhoneContact?.some(
            (existing) => existing === contact.osRepertoryPhoneNumber,
          ),
      )
      .map((c: SimpleContactType) => {
        const federUser =
          res.data?.getMobileContactFederByPhoneNumber?.nodes.find(
            (fu) => fu?.phoneNumber === c.osRepertoryPhoneNumber,
          );
        return {
          ...c,
          isFederUser: !!federUser,
          hasMeInTeam: !!federUser?.userContacts?.totalCount,
        };
      });
    setContacts(
      completeMappedContacts
        .sort((a, b) => a.lastname?.localeCompare(b.lastname ?? "") ?? 0)
        .sort((a, b) => Number(b.isFederUser) - Number(a.isFederUser)),
    );
  };

  const clickItem = (contact: SimpleContactType) => {
    const newContacts = contacts.map((c) => {
      if (c.id === contact.id) {
        return { ...c, isSelected: !c.isSelected };
      }
      return c;
    });
    setContacts(newContacts);
  };

  const saveContact = async () => {
    if (contacts?.find((c) => c.isSelected))
      await saveMyNewContacts({
        variables: {
          input: {
            contacts: contacts
              .filter((c) => c.isSelected)
              .map((c) => ({
                osPhoneNumber: c.osRepertoryPhoneNumber ?? "",
                firstname: c.firstname ?? "",
                lastname: c.lastname ?? "",
              })),
          },
        },
        refetchQueries: [
          "GetUserContactViews",
          "GetSuggestions",
          "GetUserById",
        ],
        onCompleted: () => {
          refetch();
          onPress();
        },
        onError: (error) => {
          console.log("error", error);
        },
      });
  };

  const submitSearch = async (data: any) => {
    loadContacts({
      currentUser: currentUser?.currentUser,
      searchName: data?.nameSearch,
    });
  };

  useEffect(() => {
    if (currentUser?.currentUser) {
      loadContacts({ currentUser: currentUser?.currentUser });
    }
  }, [currentUser?.currentUser]);

  return (
    <ThemedView className="grow" style={{ backgroundColor: colorSlate50 }}>
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
          data={contacts}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          onScroll={({ nativeEvent }) => {
            setIsScrolled(nativeEvent.contentOffset.y > 100);
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          keyExtractor={(item) =>
            item?.id ?? item?.osRepertoryPhoneNumber ?? ""
          }
          ListHeaderComponent={<View style={{ height: 20 }} />}
          ListFooterComponent={<View style={{ height: 140 }} />}
          ListEmptyComponent={
            <EmptyComponentList
              title="Aucun contact à afficher"
              content="Votre répertoire est vide, ajoutez des contacts pour les retrouver ici"
            />
          }
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

      <ContainerButtonSheet shadow title="Sélectionnez vos coéquipiers">
        <BaseButton
          title="Ajouter la sélection"
          type="solid"
          onPress={saveContact}
        />
      </ContainerButtonSheet>
    </ThemedView>
  );
};
