type CustomColor =
  | "text"
  | "background"
  | "primary"
  | "secondary"
  | "accent"
  | "wrong"
  | "white"
  | "black"
  | "transparent";

type CustomTextSize =
  | "text-xs"
  | "text-sm"
  | "text-base"
  | "text-lg"
  | "text-xl"
  | "text-2xl"
  | "text-3xl"
  | "text-4xl"
  | "text-5xl"
  | string;

type TailwindColor = CustomColor;
type TailwindTextSize = CustomTextSize;
type TailwindSizeClass = string;
type TextAlignOption = "left" | "center" | "right";

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
}
