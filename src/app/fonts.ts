import { Onest } from "next/font/google";
import localFont from "next/font/local";

export const gomiesFont = localFont({ src: "./Gomie-font.woff" });
export const prettyFont = localFont({ src: "./prettywise-light.otf" });
export const onest = Onest({ subsets: ["latin"] });
