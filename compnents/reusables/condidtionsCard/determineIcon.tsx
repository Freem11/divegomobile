import React from "react";

import Icon from "../../../icons/Icon";
import { colors } from "../../styles";

export function determineIcon(first: string, rest: string[]) {

  if (rest.includes("Current")) {
    return "more";
  }
  if (rest.includes("Lateral")) {
    return "ArrowsLeftRight";
  }

  if (rest.includes("Upwellings")) {
    return "ArrowCircleUp";
  }

  if (rest.includes("Downwellings")) {
    return "ArrowCircleDown";
  }

  if (rest.includes("Contrasting")) {
    return "ArrowsHorizontal";
  }

  if (rest.includes("Visibility")) {
    return "diving-snorkel";
  }
}

export function determineChipIcon(conditionText: string, textColor: string) {

  if (conditionText === "Boat Dive") {
    return <Icon name="Sailboat" color={textColor} />;
  };

  if (conditionText === "Shore Dive") {
    return <Icon name="Island" color={textColor} />;
  }

  if (conditionText === "Wreck Dive") {
    return <Icon name="anchor-alt" color={textColor} />;
  }

  if (conditionText === "Altitude") {
    return <Icon name="Mountains" color={textColor} />;
  }

  if (conditionText === "Cave Dive") {
    return <Icon name="VinylRecord" color={textColor} />;
  }

  if (conditionText === "Surge") {
    return <Icon name="Waves" color={textColor} />;
  }

  if (conditionText === "Surface Traffic") {
    return <Icon name="TrafficSignal" color={textColor} />;
  }

  if (conditionText === "No Reference Points") {
    return <Icon name="GpsSlash" color={textColor} />;
  }

  if (conditionText === "Bottom Depth > AOW Limits") {
    return <Icon name="WarningDiamond" color={textColor} />;
  }

  if (conditionText === "Kelp") {
    return <Icon name="coral-svgrepo-com 1" color={textColor} />;
  }

  if (conditionText === "Pollution") {
    return <Icon name="BeerBottle" color={textColor} />;
  }

  if (conditionText === "Night Dive") {
    return <Icon name="MoonStars" color={textColor} />;
  }

  if (conditionText === "Salt Water") {
    return <Icon name="salt-water" color={textColor} />;
  }

  if (conditionText === "Fresh Water") {
    return <Icon name="fresh-water" color={textColor} />;
  }

  if (conditionText.includes("Follow")) {
    return <Icon name="plus" color={textColor} />;
  }

  if (conditionText.includes("Unfollow")) {
    return <Icon name="close" color={textColor} />;
  }

}

export function determineViz(vizVal: number) {

  if (vizVal >= 0 && vizVal <= 3) {
    return { bgColor: colors.red, textColor: colors.themeWhite };
  }

  if (vizVal > 3 && vizVal <= 10) {
    return { bgColor: colors.orangeLight, textColor: colors.themeBlack };
  }

  if (vizVal > 10 && vizVal <= 20) {
    return { bgColor: colors.primaryBlue, textColor: colors.themeWhite };
  }

  if (vizVal > 20) {
    return { bgColor: colors.green, textColor: colors.themeBlack };
  }

}

export function determineIntensity(intensityVal: string) {

  if (intensityVal === "No") {
    return { bgColor: colors.green, textColor: colors.themeBlack };
  }

  if (intensityVal === "Weak") {
    return { bgColor: colors.primaryBlue, textColor: colors.themeWhite };
  }

  if (intensityVal === "Moderate") {
    return { bgColor: colors.secondaryYellow, textColor: colors.themeBlack };
  }

  if (intensityVal === "Strong") {
    return { bgColor: colors.orangeLight, textColor: colors.themeBlack };
  }

  if (intensityVal === "Dangerous") {
    return { bgColor: colors.red, textColor: colors.themeBlack };
  }

}