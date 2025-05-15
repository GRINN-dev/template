export const getGender = (gender: string) => {
  switch (gender) {
    case "HOMME":
      return "Homme";
    case "FEMME":
      return "Femme";
    case "AUTRE":
      return "Autre";
  }
};
