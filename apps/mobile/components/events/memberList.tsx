import { useState } from "react";
import { FlatList, View } from "react-native";
import { useQuery } from "@apollo/client";

import { Contact } from "@/components/old/(auth)/event-edition/event-edition";
import { ResultOf } from "@/graphql";
import { CurrentUserQuery } from "@/graphql/current-user";
import { UserContactQuery } from "@/graphql/queries-content";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { BaseButton } from "../ui/base-button";
import { ContainerButtonSheet } from "../ui/containerButtonSheet";
import { ContactCardEvent } from "./ContactCardEvent";

export type UserContactQueryProps = ResultOf<typeof UserContactQuery>;

// On modifie le type de la prop pour recevoir des objets Contact au lieu d'ids
export const MemberList = ({
  onUpdateList,
  initialContacts,
}: {
  onUpdateList: (contacts: Contact[]) => void;
  initialContacts?: Contact[];
}) => {
  const isSmall = useIsWidthLessThan400();

  // Stocker l'état initial avec des objets Contact
  const initialSelectedMembers = initialContacts ? [...initialContacts] : [];
  const [selectedMembers, setSelectedMembers] = useState<Contact[]>(
    initialSelectedMembers,
  );

  const { data: currentUser } = useQuery(CurrentUserQuery);
  const { data: userContactViews, fetchMore } = useQuery(UserContactQuery, {
    variables: {
      userID: currentUser?.currentUser?.id ?? "",
      first: 10,
      offset: 0,
    },
  });

  const toggleMember = (contact: Contact) => {
    setSelectedMembers((prev) =>
      // Vérifier par id si le contact est déjà sélectionné
      prev.some((member) => member.id === contact.id)
        ? prev.filter((member) => member.id !== contact.id)
        : [...prev, contact],
    );
  };

  const handleValidate = () => {
    onUpdateList(selectedMembers);
  };

  // Vérifier si la liste a été modifiée par rapport à l'état initial.
  const isModified =
    selectedMembers.length !== initialSelectedMembers.length ||
    selectedMembers.some(
      (member) => !initialSelectedMembers.some((init) => init.id === member.id),
    );

  return (
    <View className="flex-1">
      <View className="flex-1">
        <FlatList
          data={userContactViews?.userContacts?.nodes}
          contentContainerStyle={{
            paddingHorizontal: isSmall ? 12 : 16,
            paddingVertical: 16,
          }}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          ListFooterComponent={<View style={{ height: 10 }} />}
          renderItem={({ item }) => {
            const contact = item?.contact;
            // Déterminer si le contact est sélectionné en comparant l'id
            const isSelected = selectedMembers.some(
              (member) => member.id === contact?.id,
            );
            return (
              <ContactCardEvent
                key={contact?.id}
                contact={item as any}
                onPress={() => toggleMember(contact as Contact)}
                isSelected={isSelected}
              />
            );
          }}
          onEndReached={() => {
            if (
              !userContactViews?.userContacts?.totalCount ||
              userContactViews?.userContacts?.totalCount === 0
            )
              return;
            fetchMore({
              variables: {
                offset: userContactViews?.userContacts?.nodes?.length ?? 0,
                first: 10,
              },
              updateQuery: (previousQueryResult, { fetchMoreResult }) => {
                if (!fetchMoreResult?.userContacts?.nodes?.length)
                  return previousQueryResult;
                return {
                  userContacts: {
                    nodes: [
                      ...(previousQueryResult?.userContacts?.nodes ?? []),
                      ...fetchMoreResult?.userContacts?.nodes,
                    ],
                    totalCount: fetchMoreResult?.userContacts?.totalCount,
                  },
                };
              },
            });
          }}
        />
      </View>
      <ContainerButtonSheet shadow>
        <BaseButton
          title="Ajouter la sélection"
          type="solid"
          disable={!isModified}
          onPress={handleValidate}
        />
      </ContainerButtonSheet>
    </View>
  );
};
