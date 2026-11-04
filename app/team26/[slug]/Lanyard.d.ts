import type { CSSProperties, FC } from "react";
import type { MemberIdCard } from "./member-id-card";

export interface LanyardProps {
  member: MemberIdCard;
  fontFamily: string;
  cutoutUrl?: string;
  cardColor?: string;
  orientation?: "portrait" | "landscape";
  finish?: "glossy" | "matte" | "holographic" | "metallic";
  cornerRadius?: number;
  size?: number;
  anchor?: "left" | "center" | "right" | number;
  strapLength?: number;
  bottomInset?: number;
  strapImage?: string;
  strapColor?: string;
  strapWidth?: number;
  metal?: "graphite" | "silver" | "gold";
  gravity?: number;
  damping?: number;
  elasticity?: number;
  breeze?: number;
  active?: boolean;
  interactive?: boolean;
  intro?: boolean;
  className?: string;
  style?: CSSProperties;
}

declare const Lanyard: FC<LanyardProps>;
export default Lanyard;
