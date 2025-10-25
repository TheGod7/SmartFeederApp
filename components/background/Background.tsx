import { ImageBackground } from "expo-image";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Position = "top" | "bottom" | "both";

interface BackgroundProps {
  position?: Position;
  topSource?: any;
  bottomSource?: any;
  headerHeight?: number;
}

const Background: React.FC<BackgroundProps> = ({
  position = "bottom",
  topSource,
  bottomSource,
  headerHeight = 70,
}) => {
  const insets = useSafeAreaInsets();

  const TopImg = topSource ?? require("@/assets/background/Top.png");
  const BottomImg = bottomSource ?? require("@/assets/background/Bottom.png");

  return (
    <>
      {(position === "top" || position === "both") && (
        <ImageBackground
          source={TopImg}
          contentFit="cover"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: headerHeight + insets.top,
            zIndex: 0,
          }}
          pointerEvents="none"
        />
      )}

      {(position === "bottom" || position === "both") && (
        <ImageBackground
          source={BottomImg}
          contentFit="cover"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: headerHeight + insets.bottom,
            zIndex: 0,
          }}
          pointerEvents="none"
        />
      )}
    </>
  );
};

export default Background;
