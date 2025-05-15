import { Alert, Share } from "react-native";
import { Contact } from "expo-contacts";
import { ApolloError } from "@apollo/client";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { usePostHog } from "posthog-react-native";

import { SimpleContactType } from "@/components/squad/contact-card";
import Config from "@/constants/Config";
import { ResultOf } from "@/graphql";
import { CurrentUserQuery } from "@/graphql/current-user";

export const GOOGLE_MAPS_API = "AIzaSyB31IOYP6Qy0kixMEffAz8c6GT8pxeV6Gk";

/**
 * mapping pour formater un contact de l'os pour notre front
 * @param contact one contact from the phone
 * @returns un contact formaté pour notre front
 */
export const contactMapping = (contact: Contact): SimpleContactType => {
  return {
    id: contact.id ?? "",
    firstname: contact.firstName ?? "",
    lastname: contact.lastName,
    // email: contact.emails?.[0].email,
    avatarUrl: contact.image?.uri,
    osRepertoryPhoneNumber: getFormattedMobileNumber(contact) ?? "",
    isSelected: false,
  };
};

export function formatDateWithMonth(dateInput: string) {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  // Vérification que la date est valide
  if (isNaN(date.getTime())) {
    return "";
  }

  // On supporte uniquement le format "d MMMM yyyy 'à' HH'h'mm" pour l'instant.
  const day = date.getDate();
  // Le nom du mois sera en français grâce à la locale 'fr-FR'
  const month = date.toLocaleString("fr-FR", { month: "long" });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year} à ${hours}h${minutes}`;
}

const getFormattedMobileNumber = (contact: any): string | null => {
  if (!contact.phoneNumbers || contact.phoneNumbers.length === 0) {
    return null; // Aucun numéro disponible
  }

  // Trouver un numéro avec le label "portable" ou un autre numéro par défaut
  const mobileNumber =
    contact.phoneNumbers.find((p: any) =>
      ["portable", "mobile", "iPhone"].includes(p.label?.toLowerCase()),
    ) || contact.phoneNumbers[0]; // Si aucun portable, prendre le premier

  if (!mobileNumber) return null;

  const { number, countryCode } = mobileNumber;

  // Formater avec libphonenumber-js
  const parsed = parsePhoneNumberFromString(
    number,
    countryCode?.toUpperCase() || "FR",
  );

  return parsed ? parsed.formatInternational().replace(/\s/g, "") : number;
};

export const FranceRegion = {
  latitude: 46.603354,
  longitude: 1.888334,
  latitudeDelta: 14,
  longitudeDelta: 14,
};

export const formatDate = (dateString: any) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `Date : ${day}/${month}/${year} - ${hours}:${minutes}`;
};

export const statusEnum: Record<string, string> = {
  INV: "Invitation",
  ASK: "Demande",
  GO: "Viens",
  NO: "Ne viens pas",
  MAYBE: "Peut-être",
  DENY: "Refusé",
};

export const calculDiffDays = (baseDate: string, secondDate: Date) => {
  const eventDate = new Date(baseDate);
  const now = secondDate;
  const eventDay = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate(),
  );
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = eventDay.getTime() - nowDay.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const mapStyle = [
  {
    featureType: "poi.attraction",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.government",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.medical",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.place_of_worship",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.school",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
];

export const onShare = async () => {
  try {
    const result = await Share.share({
      title: "Feder",
      message: "Rejoins moi sur feder : l'app qui connecte les sportifs",
      url: "https://feder.app/",
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
        console.log(result.activityType);
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error: any) {
    Alert.alert("error:", error.message);
  }
};

export const hexToRgba = (hex: any, alpha = 1) => {
  // Supprime le caractère '#' si présent
  hex = hex.replace("#", "");

  // Gère les codes en format court (#03F)
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c: any) => c + c)
      .join("");
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const darkenColor = (hex: string, amount = 0.2): string => {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - 255 * amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - 255 * amount);
  const b = Math.max(0, (num & 0x0000ff) - 255 * amount);
  return `rgb(${r}, ${g}, ${b})`;
};

export type CurrentUserData = ResultOf<typeof CurrentUserQuery>;

export const checkUserRoute = (data: CurrentUserData) => {
  if (
    data?.currentUser?.profileValidated &&
    data?.currentUser?.isPhoneCodeUsed &&
    data?.currentUser?.gender
  ) {
    return "/(auth)/(tabs)/events";
  } else if (data?.currentUser?.profileValidated && data?.currentUser?.gender) {
    return "/(auth)/(tabs)/squad?tab=onboarding";
  } else {
    return "/(auth)/profile/profile";
  }
};
