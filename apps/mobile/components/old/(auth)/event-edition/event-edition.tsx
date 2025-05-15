import { useLocalSearchParams } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";

import { CreateEventsMap } from "@/components/events/CreateEventMap";
import { ThemedView } from "@/components/ThemedView";

import "react-native-get-random-values";

import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

import { createForm } from "@/components/events/formEvent/createUpdateObject";
import { MemberList } from "@/components/events/memberList";
import { UpsertEventForm } from "@/components/events/UpsertEventForm";
import { HeaderRouter } from "@/components/header/header-router";
import { colorSlate50 } from "@/constants/ColorsFeder";
import { ResultOf } from "@/graphql";
import { EventByIdQuery } from "@/graphql/queries-content";

export interface Contact {
  avatarUrl: string;
  avatarColor: string;
  firstname: string;
  id: string;
  lastname: string;
}

export type GetEventByIdResult = ResultOf<typeof EventByIdQuery>;
export interface SquadTabStatus {
  tab: "map" | "form" | "invitation";
}
export default function CreateEvent() {
  const insets = useSafeAreaInsets();
  const { tab, statusBar, eventId } = useLocalSearchParams();
  const [tabStatus, setTabStatus] = useState<SquadTabStatus["tab"]>(
    statusBar === "form" ? statusBar : "map",
  );

  const [addressId, setAddressId] = useState<string | null>(null);
  const [info, setInfo] = useState<boolean>(true);
  if (tab && tab !== tabStatus) {
    // Pour éviter une boucle infinie
    setTabStatus(tab as SquadTabStatus["tab"]);
  }

  const now = new Date();
  const in30Min = new Date(now.getTime() + 30 * 60000);

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createForm),
    defaultValues: {
      title: null,
      description: null,
      date: in30Min,
      time: in30Min,
      visibility: null,
      sport: null,
      invitedUsers: [] as Contact[],
      isClosed: false,
      maxParticipants: undefined,
    },
  });

  const { data: dataEvent, loading } = useQuery(EventByIdQuery, {
    variables: { id: eventId as string },
    skip: !eventId,
    onCompleted: (data) => {
      setValue("title", data?.event?.title ?? "");
      setValue("description", data?.event?.description ?? "");
      setValue(
        "date",
        data?.event?.startAt ? new Date(data?.event?.startAt) : in30Min,
      );
      setValue(
        "time",
        data?.event?.startAt ? new Date(data?.event?.startAt) : in30Min,
      );
      setValue("visibility", data?.event?.visibility ?? "");
      setValue("sport", data?.event?.sport?.id ?? "");
      const users = data?.event?.userEvents.nodes.map(
        (
          n: NonNullable<GetEventByIdResult["event"]>["userEvents"]["nodes"][0],
        ) => {
          return {
            id: n?.user?.id!,
            firstname: n?.user?.firstname,
            lastname: n?.user?.lastname,
            avatarColor: n?.user?.avatarColor,
            avatarUrl: n?.user?.avatarUrl,
          };
        },
      );

      setValue("invitedUsers", users);
      setValue("isClosed", data?.event?.isClosed ?? false);
      if (data?.event?.maxParticipants)
        setValue("maxParticipants", data?.event?.maxParticipants);

      const startAt = new Date(data?.event?.startAt!);
      setSelectedDateInput(startAt?.toLocaleDateString());
      setSelectedTimeInput(startAt?.toLocaleTimeString());
    },
  });

  const [selectedDateInput, setSelectedDateInput] = useState(
    dataEvent?.event?.startAt
      ? new Date(dataEvent?.event?.startAt).toLocaleDateString()
      : "Choisir une date",
  );
  const [selectedTimeInput, setSelectedTimeInput] = useState(
    dataEvent?.event?.startAt
      ? new Date(dataEvent?.event?.startAt).toLocaleTimeString()
      : "Choisir une heure",
  );

  const onUpdateInvitedList = (contacts: Contact[]) => {
    setValue("invitedUsers", contacts); // On stocke les objets complets
    setTabStatus("form");
  };

  const handleAddressSuccess = (addressId: string) => {
    setTabStatus("form");
    setAddressId(addressId);
  };

  switch (tabStatus) {
    case "map":
      return (
        <ThemedView className="flex-1">
          <CreateEventsMap
            info={info}
            setInfo={setInfo}
            onSuccess={handleAddressSuccess}
            addressId={addressId ?? ""}
          />
        </ThemedView>
      );
    case "form":
      return (
        <ThemedView
          className="flex-1"
          style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            backgroundColor: colorSlate50,
          }}
        >
          <HeaderRouter
            title={dataEvent ? "Voir la carte" : "Créer une activité"}
            closeLogo
            push={() => setTabStatus("map")}
          />
          <UpsertEventForm
            addressId={
              addressId ? addressId : (dataEvent?.event?.addressesId ?? "")
            }
            selectedTimeInput={selectedTimeInput}
            setSelectedTimeInput={(time) => setSelectedTimeInput(time)}
            selectedDateInput={selectedDateInput}
            setSelectedDateInput={(date) => setSelectedDateInput(date)}
            setValue={setValue}
            openInvitation={() => setTabStatus("invitation")}
            goToMap={() => setTabStatus("map")}
            control={control}
            handleSubmit={handleSubmit}
            errors={errors}
            eventId={eventId as string}
            type={dataEvent ? "update" : "create"}
            memberSelecteds={getValues("invitedUsers")}
            // invitedAvatars={getValues("invitedUsers")}
            invitedCount={getValues("invitedUsers")?.length ?? 0}
          />
        </ThemedView>
      );
    case "invitation":
      return (
        <ThemedView
          className="flex-1"
          style={{
            paddingTop: insets.top,
            backgroundColor: colorSlate50,
          }}
        >
          <HeaderRouter
            title="Inviter des membres"
            push={() => setTabStatus("form")}
            closeLogo
          />
          <MemberList
            onUpdateList={onUpdateInvitedList}
            initialContacts={getValues("invitedUsers")}
          />
        </ThemedView>
      );
  }
}
