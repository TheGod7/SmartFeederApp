import { Image as ExpoImage, ImageProps } from "expo-image";
import { cssInterop } from "nativewind";
import React from "react";

const StyledExpoImage = cssInterop(ExpoImage, {
  className: "style",
});

interface MyImageProps extends Omit<ImageProps, "className"> {
  className?: string;
}

export const Image = (props: MyImageProps) => {
  return <StyledExpoImage {...props} />;
};
