import React from "react";
import {
  TextInput as Input,
  Pressable,
  Text,
  TextInputProps,
  View,
} from "react-native";
import { Image } from "./CustomImage";

interface CustomTextInputProps extends TextInputProps {
  title: string;
  footer?: string;
  color?: CustomColor;
  titleSize?: CustomTextSize;
  inputSize?: CustomTextSize;
  footerSize?: CustomTextSize;

  icoSource?: any;
  icoPressable?: boolean;
  icoOnPress?: () => void;

  customW?: string;
  icoH?: string;
  icoW?: string;
}

const TextInputComponent: React.FC<CustomTextInputProps> = ({
  title,
  footer,
  titleSize,
  inputSize,
  footerSize,
  color,
  icoSource,
  customW,
  icoPressable,
  icoOnPress,
  icoH,
  icoW,
  ...props
}) => {
  const textColorClass = color ? `text-${color}` : "text-primary";
  const borderColorClass = color ? `border-b-${color}` : "border-b-primary";

  const defaultTitleSize = "text-xl";
  const defaultInputSize = "text-base";
  const defaultFooterSize = "text-sm";

  const defaultIcoH = "h-8";
  const defaultIcoW = "w-8";

  const footerHeightClass = "h-5";

  return (
    <View className={`flex flex-col gap-2 ${customW ? customW : "w-full"}`}>
      <Text
        className={`
          ${titleSize ? titleSize : defaultTitleSize} 
          ${textColorClass}
          font-itim
        `}
      >
        {title}
      </Text>

      <View className="flex-row items-center w-full">
        <Input
          className={`
            text-text 
            placeholder:text-text/70 
            font-itim 
            ${inputSize ? inputSize : defaultInputSize} 
            border-b-4 
            ${borderColorClass} 
            rounded-lg
            p-0 pt-0 pb-0 
            min-h-10 
            flex-1 
            pr-2
          `}
          {...props}
        />

        {icoSource && (
          <Pressable
            className={`${icoPressable ? `active:opacity-70` : ``} ml-2`}
            onPress={icoOnPress}
          >
            <Image
              source={icoSource}
              className={`${icoW ? icoW : defaultIcoW} ${icoH ? icoH : defaultIcoH}`}
            />
          </Pressable>
        )}
      </View>

      <View className={footerHeightClass}>
        {footer && (
          <Text
            className={`
              ${footerSize ? footerSize : defaultFooterSize} 
              ${textColorClass} 
              font-itim
            `}
          >
            {footer}
          </Text>
        )}
      </View>
    </View>
  );
};

export default TextInputComponent;
