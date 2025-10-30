import React from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Image } from "./CustomImage";

type RoundedSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";

interface CustomButton extends PressableProps {
  text: string;
  textSize?: TailwindTextSize;
  customW?: TailwindSizeClass;
  customH?: TailwindSizeClass;
  textColor?: TailwindColor;
  backgroundColor?: TailwindColor;
  textAlign?: "left" | "center" | "right";
  border?: BorderConfig;
  icon?: IcoConfig;
  activeOpacity?: 30 | 50 | 70 | 90;
  rounded?: RoundedSize;
  padding?: string;
  baseBackgroundColor?: TailwindColor;
  iconSpacing?: "normal" | "edge";
}

interface IcoConfig {
  source: any;
  IcoSize?: TailwindSizeClass;
  icoAlign?: "left" | "right";
}

interface BorderConfig {
  borderColor?: TailwindColor;
  borderSize?: 1 | 2 | 4 | 8;
  borderStyle?: "solid" | "dashed" | "dotted";
}

export default function SimpleButton({
  text,
  textSize,
  customW,
  customH,
  textColor,
  backgroundColor,
  textAlign = "center",
  border,
  icon,
  activeOpacity = 70,
  rounded = "xl",
  padding = "py-3 px-6",
  baseBackgroundColor,
  iconSpacing = "normal",
  ...props
}: CustomButton) {
  const defaultTextSize = "text-xl";
  const defaultIcoSize = "h-7 w-7";
  const defaultCustomW = "w-auto";
  const defaultCustomH = "h-auto";

  const pressableClass = `${customW ? customW : defaultCustomW} active:opacity-${activeOpacity}`;
  const borderClasses = border
    ? `border ${border.borderSize ? `border-${border.borderSize}` : "border-4"} ${
        border.borderColor ? `border-${border.borderColor}` : ""
      }`
    : "";
  const bgClass =
    backgroundColor === "transparent"
      ? ""
      : backgroundColor
        ? `bg-${backgroundColor}`
        : "bg-primary";
  const extraStyle: StyleProp<ViewStyle> =
    border && border.borderStyle
      ? { borderStyle: border.borderStyle as ViewStyle["borderStyle"] }
      : {};

  const isIconEdge = iconSpacing === "edge";
  const iconMarginClass = !isIconEdge ? "mx-2" : "";

  let textAlignClass = "text-center";
  if (textAlign === "left") textAlignClass = "text-left";
  else if (textAlign === "right") textAlignClass = "text-right";

  return (
    <Pressable className={pressableClass} {...props}>
      {baseBackgroundColor && (
        <View
          className={`absolute inset-0 rounded-${rounded} bg-${baseBackgroundColor}`}
          pointerEvents="none"
        />
      )}
      <View
        style={extraStyle}
        className={`
          relative
          ${bgClass}
          rounded-${rounded}
          ${padding}
          items-center
          ${borderClasses}
          flex-row
          ${customH ? customH : defaultCustomH}
          w-auto
          ${isIconEdge ? "justify-between" : "justify-center"}
        `}
      >
        {icon && icon.icoAlign === "left" && (
          <Image
            source={icon.source}
            className={`${icon.IcoSize ? icon.IcoSize : defaultIcoSize} ${iconMarginClass}`}
          />
        )}
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className={`
            font-itim
            ${textSize ? textSize : defaultTextSize}
            ${textColor ? `text-${textColor}` : "text-text"}
            flex-1
            ${isIconEdge ? textAlignClass : "text-center"}
          `}
        >
          {text}
        </Text>
        {icon && icon.icoAlign === "right" && (
          <Image
            source={icon.source}
            className={`${icon.IcoSize ? icon.IcoSize : defaultIcoSize} ${iconMarginClass}`}
          />
        )}
      </View>
    </Pressable>
  );
}
