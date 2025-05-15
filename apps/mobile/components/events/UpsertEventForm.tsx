import { useRef, useState } from "react";
import {
  findNodeHandle,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "@apollo/client";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { usePostHog } from "posthog-react-native";
import { Control, Controller, UseFormSetValue } from "react-hook-form";

import { Contact } from "@/components/old/(auth)/event-edition/event-edition";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { colorPrimary700, colorSlate50 } from "@/constants/ColorsFeder";
import { CurrentUserQuery } from "@/graphql/current-user";
import {
  CreateEventMutation,
  DeleteEventMutation,
  UpdateEventMutation,
  UpsertUserEventMutation,
} from "@/graphql/mutations/event";
import { GetAllCategoriesQuery } from "@/graphql/queries-content";
import { updateCalendar } from "@/utils/event-calendar-edition";
import { InputField } from "../form/InputField";
import { BaseButton } from "../ui/base-button";
import { CardInviteSquad } from "../ui/CardInviteSquad";
import { ContainerButtonSheet } from "../ui/containerButtonSheet";
import { EventMapRappel } from "./EventMapRappel";

export const UpsertEventForm = ({
  addressId,
  openInvitation,
  goToMap,
  eventId,
  type,
  control,
  errors,
  handleSubmit,
  // invitedAvatars,
  memberSelecteds,
  invitedCount,
  selectedDateInput,
  setSelectedDateInput,
  selectedTimeInput,
  setSelectedTimeInput,
  setValue,
}: {
  addressId: string;
  openInvitation: () => void;
  goToMap: () => void;
  eventId?: string;
  type: "create" | "update";
  control: Control<any>;
  handleSubmit: any;
  errors: any;
  memberSelecteds?: Contact[];
  // invitedAvatars: Contact[];
  invitedCount: number;
  selectedDateInput: string;
  setSelectedDateInput: (value: string) => void;
  selectedTimeInput: string;
  setSelectedTimeInput: (value: string) => void;
  setValue: UseFormSetValue<{
    title: null;
    description: null;
    date: Date;
    time: Date;
    visibility: null;
    sport: null;
    invitedUsers: Contact[];
    isClosed: boolean;
    maxParticipants: undefined;
  }>;
}) => {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const posthog = usePostHog();
  const { data: currentUser, loading: loadingUser } =
    useQuery(CurrentUserQuery);

  const { data: sportCategories, loading: sportsLoading } = useQuery(
    GetAllCategoriesQuery,
  );
  const [createEventMutation] = useMutation(CreateEventMutation, {
    refetchQueries: [
      "UpcomingEventsQuery",
      "CurrentUserQuery",
      "EventByIdQuery",
    ],
  });
  const [updateEventMutation] = useMutation(UpdateEventMutation, {
    refetchQueries: ["UpcomingEventsQuery", "EventByIdQuery"],
  });
  const [upsertUserEvent] = useMutation(UpsertUserEventMutation, {
    refetchQueries: ["EventByIdQuery"],
  });
  const [deleteEvent] = useMutation(DeleteEventMutation);

  const onSubmitCreate = async (createForm: any) => {
    try {
      const { data } = await createEventMutation({
        variables: {
          input: {
            event: {
              visibility: createForm.visibility,
              sportId: createForm.sport,
              title: createForm.title,
              description: createForm.description,
              organizerId: currentUser?.currentUser?.id || "",
              startAt: createForm.date,
              addressesId: addressId,
              maxParticipants: createForm?.maxParticipants,
            },
          },
        },
      });

      posthog?.capture("activity_created", {
        description: "Création d'une activité",
        properties: [
          data?.event?.sport?.name,
          data?.event?.level ?? "-",
          data?.event?.startAt,
          data?.event?.description,
        ],
        tags: ["Activités / Création", "ActivityEditionScreen", "Haute"],
        type: "event",
      });

      if (data?.createEvent?.event?.id && memberSelecteds?.length! > 0) {
        console.log("Event created");
        try {
          const invitedUsersIds = createForm?.invitedUsers?.map(
            (u: any) => u.id,
          );
          upsertUserEvent({
            variables: {
              input: {
                pEventId: data?.createEvent?.event?.id,
                pUserIds: invitedUsersIds,
              },
            },
          });
          router.push({
            pathname: "/(auth)/(tabs)/sessions",
            params: {
              statusBar: "index",
              eventId: data?.createEvent?.event?.id,
            },
          });
        } catch (err) {
          console.log("err", err);
        }
      }
      router.push({
        pathname: "/(auth)/(tabs)/sessions",
        params: { statusBar: "index", eventId: data?.createEvent?.event?.id },
      });
    } catch (err) {
      console.log("err", err);
      posthog?.capture("activity_creation_failed", {
        description: "échec de création d'une activité",
        properties: [{ error: (err as Error)?.message }],
        tags: ["Activités / Création", "ActivityEditionScreen", "Moyenne"],
        type: "event",
      });
    } finally {
      console.log("finally");
    }
  };

  const onSubmitUpdate = async (createForm: any) => {
    try {
      const { data } = await updateEventMutation({
        variables: {
          input: {
            id: eventId ?? "",
            patch: {
              visibility: createForm?.visibility,
              sportId: createForm?.sport,
              title: createForm?.title,
              description: createForm?.description,
              startAt: createForm?.date,
              addressesId: addressId,
              isClosed: createForm?.isClosed,
              maxParticipants: createForm?.maxParticipants,
            },
          },
        },
      });

      posthog?.capture("activity_edited", {
        description: "Modification d'une activité",
        // properties: ["fields_modified"],
        tags: ["Activités / édition", "ActivityEditionScreen", "Moyenne"],
        type: "event",
      });

      await updateCalendar(createForm, eventId!);
      if (data?.updateEvent?.event?.id) {
        try {
          const invitedUsersIds = createForm?.invitedUsers?.map(
            (u: any) => u.id,
          );
          await upsertUserEvent({
            variables: {
              input: {
                pEventId: eventId,
                pUserIds: invitedUsersIds,
              },
            },
          });
          router.push("/(auth)/(tabs)/sessions");
        } catch (err) {
          console.log("err", err);
        }
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      console.log("finally");
    }
  };
  const buttonTitle =
    memberSelecteds === null
      ? // Aucun changement dans le formulaire, on se base sur les données du back
        invitedCount > 0
        ? `${invitedCount} Modifier les coéquipiers`
        : "Inviter des coéquipiers"
      : // Le formulaire a été modifié, même si le tableau est vide
        memberSelecteds?.length! > 0
        ? ` Modifier les coéquipiers`
        : "Inviter des coéquipiers";

  const openAndroidDatePicker = (
    value: any,
    onChange: any,
    setSelectedDateInput: any,
  ) => {
    const currentDate = value;
    DateTimePickerAndroid.open({
      value: value ? new Date(value) : new Date(),
      mode: "date",
      display: "calendar",
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          const updatedDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            currentDate.getHours(),
            currentDate.getMinutes(),
            currentDate.getSeconds(),
          );
          onChange(updatedDate);
          setSelectedDateInput(updatedDate.toLocaleDateString());
        }
      },
    });
  };
  const openAndroidTimePicker = (
    value: any,
    onChange: any,
    setSelectedTimeInput: any,
  ) => {
    const currentDate = value;
    DateTimePickerAndroid.open({
      value: value ? new Date(value) : new Date(),
      mode: "time",
      display: "clock",
      onChange: (event, selectedTime) => {
        if (selectedTime) {
          const updatedDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            selectedTime.getHours(),
            selectedTime.getMinutes(),
            selectedTime.getSeconds(),
          );
          onChange(updatedDate);
          setSelectedTimeInput(updatedDate.toLocaleTimeString());
        }
      },
    });
  };
  const scrollViewRef = useRef<ScrollView>(null);

  const fieldRefs = {
    visibility: useRef<View>(null),
    sport: useRef<View>(null),
    date: useRef<View>(null),
    time: useRef<View>(null),
    maxParticipants: useRef<View>(null),
    title: useRef<View>(null),
    description: useRef<View>(null),
  };
  const scrollToError = (errors: any) => {
    const firstErrorField = Object.keys(errors)[0];
    const ref = fieldRefs[firstErrorField as keyof typeof fieldRefs];

    if (ref?.current) {
      const handle = findNodeHandle(ref.current);
      if (handle && scrollViewRef.current) {
        UIManager.measureLayout(
          handle,
          findNodeHandle(scrollViewRef.current) as number,
          () => {},
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
          },
        );
      }
    }
  };

  const submit = () => {
    handleSubmit(
      type === "create" ? onSubmitCreate : onSubmitUpdate(control._formValues),
      scrollToError,
    )();
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: Platform.OS === "ios" ? 16 : 32,
          }}
        >
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 16,
            }}
          >
            <View style={{ gap: 16 }}>
              <View style={{ gap: 8 }}>
                {type === "update" && (
                  <View className="flex flex-row">
                    <ThemedText className="grow">
                      Fermer les inscriptions
                    </ThemedText>
                    <Controller
                      control={control}
                      name="isClosed"
                      render={({ field: { onChange, value } }) => (
                        <Switch
                          trackColor={{ false: "#767577", true: "white" }}
                          thumbColor={value ? "#767577" : "#f4f3f4"}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={onChange}
                          value={value}
                        />
                      )}
                    />
                  </View>
                )}
                <View
                  style={{
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      gap: 8,
                    }}
                    ref={fieldRefs.visibility}
                  >
                    <ThemedText>Visibilité</ThemedText>
                    <InputField
                      control={control}
                      name="visibility"
                      errors={""}
                      title="Visibilité"
                      type="select"
                      placeHolder="Ouvert à tous, mon équipe ou privé"
                      items={[
                        { label: "Ouvert à tous", value: "ALLOPEN" },
                        { label: "Mon équipe", value: "OPENTEAM" },
                        { label: "Privé", value: "PRIVATE" },
                      ]}
                    />
                  </View>
                  <ThemedText style={{ color: "red" }}>
                    {errors?.visibility?.message?.toString()}
                  </ThemedText>
                </View>
                <View
                  style={{
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      gap: 8,
                    }}
                    ref={fieldRefs.sport}
                  >
                    <ThemedText>Sport proposé</ThemedText>
                    <InputField
                      control={control}
                      name="sport"
                      errors={""}
                      title="Sport"
                      type="select"
                      placeHolder="Choisir un sport"
                      items={sportCategories?.categories?.nodes
                        .flatMap((category: any) => {
                          return category?.sports?.nodes ?? [];
                        })
                        ?.map((sport: any) => ({
                          label: sport.name,
                          value: sport.id,
                        }))}
                    />
                  </View>
                  <ThemedText style={{ color: "red" }}>
                    {errors?.sport?.message?.toString()}
                  </ThemedText>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 16,
                  }}
                >
                  <View style={{ gap: 8, flex: 1 }} ref={fieldRefs.date}>
                    <ThemedText>Date</ThemedText>
                    {Platform.OS === "ios" ? (
                      <View className="items-start">
                        <Controller
                          control={control}
                          name="date"
                          render={({ field: { onChange, value } }) => (
                            <DateTimePicker
                              value={value ? new Date(value) : new Date()}
                              mode="date"
                              minimumDate={new Date()}
                              display="default"
                              onChange={(event, selectedDate) => {
                                if (selectedDate) {
                                  const old = value
                                    ? new Date(value)
                                    : new Date();
                                  const newDate = new Date(
                                    selectedDate.getFullYear(),
                                    selectedDate.getMonth(),
                                    selectedDate.getDate(),
                                    old.getHours(),
                                    old.getMinutes(),
                                    old.getSeconds(),
                                  );
                                  onChange(newDate);
                                  setSelectedDateInput(newDate.toISOString());
                                }
                              }}
                            />
                          )}
                        />
                      </View>
                    ) : (
                      <Controller
                        control={control}
                        name="date"
                        render={({ field: { onChange, value } }) => (
                          <TouchableOpacity
                            onPress={() =>
                              openAndroidDatePicker(
                                value,
                                onChange,
                                setSelectedDateInput,
                              )
                            }
                            style={styles.inputTime}
                          >
                            <ThemedText>
                              {selectedDateInput || "Sélectionner une date"}
                            </ThemedText>
                          </TouchableOpacity>
                        )}
                      />
                    )}
                    <ThemedText style={{ color: "red" }}>
                      {errors?.date?.message?.toString()}
                    </ThemedText>
                  </View>
                  <View style={{ gap: 8, flex: 1 }}>
                    <ThemedText>Heure</ThemedText>
                    {Platform.OS === "ios" ? (
                      <View className="items-start">
                        <Controller
                          control={control}
                          name="date"
                          render={({ field: { onChange, value } }) => (
                            <DateTimePicker
                              value={value ? new Date(value) : new Date()}
                              mode="time"
                              locale="fr-FR"
                              display="default"
                              is24Hour={true}
                              onChange={(event) => {
                                const timestamp = event?.nativeEvent?.timestamp;

                                if (timestamp) {
                                  const chosenTime = new Date(timestamp);
                                  const oldDate = value
                                    ? new Date(value)
                                    : new Date();

                                  const mergedDate = new Date(
                                    oldDate.getFullYear(),
                                    oldDate.getMonth(),
                                    oldDate.getDate(),
                                    chosenTime.getHours(),
                                    chosenTime.getMinutes(),
                                    chosenTime.getSeconds(),
                                  );

                                  console.log(
                                    "chosenTime date",
                                    mergedDate?.toISOString(),
                                  );

                                  onChange(mergedDate);
                                  setSelectedTimeInput(
                                    mergedDate.toISOString(),
                                  );
                                }
                              }}
                            />
                          )}
                        />
                      </View>
                    ) : (
                      <Controller
                        control={control}
                        name="time"
                        render={({ field: { onChange, value } }) => (
                          <TouchableOpacity
                            onPress={() =>
                              openAndroidTimePicker(
                                value,
                                onChange,
                                setSelectedTimeInput,
                              )
                            }
                            style={styles.inputTime}
                          >
                            <ThemedText>
                              {selectedTimeInput || "Sélectionner une heure"}
                            </ThemedText>
                          </TouchableOpacity>
                        )}
                      />
                    )}
                    <ThemedText style={{ color: "red" }}>
                      {errors?.time?.message?.toString()}
                    </ThemedText>
                  </View>
                </View>
                <View className="gap-2">
                  <View>
                    <InputField
                      control={control}
                      name="maxParticipants"
                      errors={errors?.maxParticipants?.message?.toString()}
                      title="Nombre maximum de participants"
                      placeHolder="Aucun"
                      type="number"
                      widthFull
                    />
                  </View>
                  <View ref={fieldRefs.title}>
                    <InputField
                      control={control}
                      errors={errors?.title?.message?.toString()}
                      name="title"
                      title="Nommez votre activité"
                      placeHolder="Nom de l'activité"
                      type="text"
                    />
                  </View>
                  <View ref={fieldRefs.description}>
                    <InputField
                      control={control}
                      errors={errors?.description?.message?.toString()}
                      name="description"
                      title="Texte personnalisé"
                      placeHolder={`Décrivez votre activité en détail pour attirer les\nbons participants !`}
                      numberOfLines={5}
                      maxLength={240}
                      type="text"
                    />
                  </View>
                </View>
              </View>
              <View>
                <EventMapRappel addressId={addressId} goToMap={goToMap} />
              </View>
              <CardInviteSquad
                title={
                  type === "create" ? "Équipes" : "Ils participent à l’activité"
                }
                buttonTitle={buttonTitle}
                openInvitation={openInvitation}
                memberSelecteds={memberSelecteds}
              />
              {type === "update" && (
                <BaseButton
                  title="Annuler l'activité"
                  type="destructive"
                  onPress={() => {
                    setDeleteOpen(true);
                  }}
                />
              )}
              <Modal
                animationType="slide"
                transparent={true}
                visible={deleteOpen}
                onRequestClose={() => {
                  setDeleteOpen(false);
                }}
              >
                <ThemedView className="flex-1 items-center justify-center gap-6 px-6">
                  <ThemedText type="default">
                    Êtes-vous sûr de vouloir supprimer cette activité?
                  </ThemedText>
                  <BaseButton
                    title="Annuler"
                    type="outlined"
                    onPress={() => setDeleteOpen(false)}
                  />
                  <BaseButton
                    title="Supprimer"
                    type="destructive"
                    onPress={() => {
                      deleteEvent({
                        variables: {
                          input: {
                            id: eventId!,
                          },
                        },
                        refetchQueries: ["Events"],
                      });
                      setDeleteOpen(false);
                      router.push("/(auth)/(tabs)/sessions");
                    }}
                  />
                </ThemedView>
              </Modal>
            </View>
            <ContainerButtonSheet backgroundColor={colorSlate50}>
              {type === "create" ? (
                <BaseButton
                  title="Créer l'événement"
                  type="solid"
                  onPress={submit}
                />
              ) : (
                <BaseButton
                  title="Modifier l'événement"
                  type="solid"
                  onPress={submit}
                />
              )}
            </ContainerButtonSheet>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: colorSlate50,
  },
  inputTime: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    height: 40,
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colorPrimary700,
  },
});
