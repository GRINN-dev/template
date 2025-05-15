import Ballon from "@/assets/svg/ballon.svg";
import Bike from "@/assets/svg/bike.svg";
import MarkerDefault from "@/assets/svg/makerDefault.svg";
import Raquette from "@/assets/svg/raquette.svg";
import Run from "@/assets/svg/run.svg";
import Badm from "@/assets/svg/SportsBadmIcon.svg";
import Bsk from "@/assets/svg/SportsBskIcon.svg";
import Crossfit from "@/assets/svg/SportsCrossfitIcon.svg";
import Escl from "@/assets/svg/SportsEsclIcon.svg";
import Golf from "@/assets/svg/SportsGolfIcon.svg";
import Gym from "@/assets/svg/SportsGymIcon.svg";
import Pad from "@/assets/svg/SportsPadIcon.svg";
import Rand from "@/assets/svg/SportsRandIcon.svg";
import Rugby from "@/assets/svg/SportsRugbyIcon.svg";
import Sail from "@/assets/svg/SportsSailIcon.svg";
import Ski from "@/assets/svg/SportsSkiIcon.svg";
import Squash from "@/assets/svg/SportsSquashIcon.svg";
import Swim from "@/assets/svg/SportsSwimIcon.svg";
import Trail from "@/assets/svg/SportsTrailIcon.svg";
import Volley from "@/assets/svg/SportsVolleyIcon.svg";

export const getSportIcon = (
  sport: string,
  color: string = "black",
  width?: number,
  height?: number,
) => {
  switch (sport) {
    case "VTT":
    case "GRAVEL":
    case "CYCL_ROAD":
      return <Bike fill={color} height={height} width={width} />;
    case "RUN":
      return <Run fill={color} height={height} width={width} />;
    case "TRAIL":
      return <Trail fill={color} height={height} width={width} />;
    case "SKI":
      return <Ski fill={color} height={height} width={width} />;
    case "SWIM":
      return <Swim fill={color} height={height} width={width} />;
    case "GOLF":
      return <Golf fill={color} height={height} width={width} />;
    case "SAIL":
      return <Sail fill={color} height={height} width={width} />;
    case "FOOT":
      return <Ballon fill={color} height={height} width={width} />;
    case "BSK":
      return <Bsk fill={color} height={height} width={width} />;
    case "RAND":
      return <Rand fill={color} height={height} width={width} />;
    case "TEN":
      return <Raquette fill={color} height={height} width={width} />;
    case "PAD":
      return <Pad fill={color} height={height} width={width} />;
    case "BADM":
      return <Badm fill={color} height={height} width={width} />;
    case "SQUASH":
      return <Squash fill={color} height={height} width={width} />;
    case "ESCL":
      return <Escl fill={color} height={height} width={width} />;
    case "RUGBY":
      return <Rugby fill={color} height={height} width={width} />;
    case "VOLLEY":
      return <Volley fill={color} height={height} width={width} />;
    case "CROSSFIT":
      return <Crossfit fill={color} height={height} width={width} />;
    case "GYM":
      return <Gym fill={color} height={height} width={width} />;
    default:
      return <MarkerDefault fill={color} height={height} width={width} />;
  }
};
