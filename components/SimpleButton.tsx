import { Pressable, PressableProps, Text, View } from "react-native";
import { Image } from "./CustomImage";

interface CustomButton extends PressableProps {
  text: string;
  textSize?: TailwindTextSize;

  customW?: TailwindSizeClass;
  customH?: TailwindSizeClass;

  textColor?: TailwindColor;
  backgroundColor?: TailwindColor;
  textAlign?: TextAlignOption;

  border?: BorderConfig;
  icon?: IcoConfig;

  activeOpacity?: 30 | 50 | 70 | 90;
}

interface IcoConfig {
  source: any;
  IcoSize?: TailwindSizeClass;
  icoAlign?: "left" | "right";
}

interface BorderConfig {
  borderColor?: TailwindColor;
  borderSize?: 1 | 2 | 4 | 8;
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
  activeOpacity = 70, // 👈 Nuevo valor por defecto
  ...props
}: CustomButton) {
  const defaultTextSize = "text-xl";
  const defaultIcoSize = "h-7 w-7";
  const defaultCustomW = "w-auto";
  const defaultCustomH = "h-auto py-3";

  // CLASE DE OPACIDAD ACTIVA: Usa la prop activa
  const activeOpacityClass = `active:opacity-${activeOpacity}`;

  const borderClasses = border
    ? `border ${border.borderSize ? `border-${border.borderSize}` : "border-4"} ${
        border.borderColor ? `border-${border.borderColor}` : ""
      }`
    : "";

  // MANEJO DE FONDO: Si es transparente, no se aplica color de fondo ni por defecto.
  const bgClass =
    backgroundColor === "transparent"
      ? ""
      : backgroundColor
        ? `bg-${backgroundColor}`
        : "bg-primary";

  const justifyClass =
    textAlign === "left"
      ? "justify-start"
      : textAlign === "right"
        ? "justify-end"
        : "justify-center";

  const textAlignClass =
    textAlign === "left"
      ? "text-left"
      : textAlign === "right"
        ? "text-right"
        : "text-center";

  const IconComponent = icon ? (
    <Image
      source={icon.source}
      className={`${icon.IcoSize ? icon.IcoSize : defaultIcoSize} mx-2`}
    />
  ) : null;

  return (
    <Pressable
      className={`${customW ? customW : defaultCustomW} ${activeOpacityClass}`} // 👈 Aplica la opacidad aquí
      {...props}
    >
      <View
        className={`
          w-auto 
          ${bgClass} 
          rounded-xl 
          px-6 
          items-center 
          ${justifyClass} 
          ${borderClasses} 
          flex-row 
          ${customH ? customH : defaultCustomH}
        `}
      >
        {icon && icon.icoAlign === "left" && IconComponent}

        <Text
          className={`
            font-itim 
            ${textSize ? textSize : defaultTextSize} 
            ${textColor ? `text-${textColor}` : "text-text"} 
            ${textAlignClass} 
            flex-shrink
          `}
        >
          {text}
        </Text>

        {icon && icon.icoAlign === "right" && IconComponent}
      </View>
    </Pressable>
  );
}
