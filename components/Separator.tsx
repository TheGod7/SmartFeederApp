import React from "react";
import { Text, View } from "react-native";

interface SeparatorProps {
  text: string;
  marginClass?: string;
  textClass?: string;
  lineClass?: string;
}

const Separator: React.FC<SeparatorProps> = ({
  text,
  marginClass = "my-3",
  textClass = "text-base text-text/70",
  lineClass = "bg-text/30 h-0.5",
}) => {
  const lineStyle = `flex-1 mx-3 ${lineClass}`;
  const textStyle = `font-itim px-3 ${textClass}`;

  return (
    <View
      className={`flex-row items-center justify-center w-full ${marginClass}`}
    >
      <View className={lineStyle} />

      <Text className={textStyle}>{text}</Text>
      <View className={lineStyle} />
    </View>
  );
};

export default Separator;
