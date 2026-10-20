"use client";

/*
 * Icon set: Phosphor, light weight (1px-style stroke, rounded caps).
 * Each export keeps the name the sections already use. Props follow one rule:
 *   fill="currentColor"  -> "fill" weight (toggle on-states)
 *   strokeWidth > 2.2    -> "regular" weight (active navigation)
 *   otherwise            -> "light"
 */
import type { ComponentType, SVGProps } from "react";
import {
  ArrowCounterClockwise, ArrowDown as PArrowDown, ArrowUp as PArrowUp, ArrowsClockwise, Bell as PBell, BookmarkSimple,
  CaretDown, CaretLeft, CaretRight, Check as PCheck, CheckCircle as PCheckCircle, CloudSlash, Compass as PCompass, Copy as PCopy,
  DotsThreeVertical, DownloadSimple, Envelope, Eye as PEye, EyeSlash, FileMagnifyingGlass, FileText as PFileText, Gear, Heart as PHeart,
  House, Image as PImage, Info as PInfo, List, Lock as PLock, MagnifyingGlass, Minus as PMinus, Monitor as PMonitor, Moon as PMoon,
  PaperPlaneRight, PencilSimple, Play as PPlay, Plus as PPlus, ShareNetwork, Star as PStar, Sun as PSun, Trash, Tray, User as PUser,
  Users as PUsers, Warning, WarningCircle, X as PX,
  type IconProps,
} from "@phosphor-icons/react";

type Props = Omit<IconProps, "weight"> & { fill?: string; strokeWidth?: number | string } & Pick<SVGProps<SVGSVGElement>, "slot">;

function wrap(Icon: ComponentType<IconProps>) {
  function Wrapped({ size = 24, fill, strokeWidth, ...rest }: Props) {
    const weight = fill === "currentColor" ? "fill" : Number(strokeWidth) > 2.2 ? "regular" : "light";
    return <Icon size={size} weight={weight} {...rest} />;
  }
  return Wrapped;
}

export const AlertCircle = wrap(WarningCircle);
export const AlertTriangle = wrap(Warning);
export const ArrowDown = wrap(PArrowDown);
export const ArrowUp = wrap(PArrowUp);
export const Bell = wrap(PBell);
export const Bookmark = wrap(BookmarkSimple);
export const Check = wrap(PCheck);
export const CheckCircle2 = wrap(PCheckCircle);
export const ChevronDown = wrap(CaretDown);
export const ChevronLeft = wrap(CaretLeft);
export const ChevronRight = wrap(CaretRight);
export const CloudOff = wrap(CloudSlash);
export const Compass = wrap(PCompass);
export const Copy = wrap(PCopy);
export const Download = wrap(DownloadSimple);
export const Eye = wrap(PEye);
export const EyeOff = wrap(EyeSlash);
export const FileQuestion = wrap(FileMagnifyingGlass);
export const FileText = wrap(PFileText);
export const Heart = wrap(PHeart);
export const Home = wrap(House);
export const ImageIcon = wrap(PImage);
export const Inbox = wrap(Tray);
export const Info = wrap(PInfo);
export const Lock = wrap(PLock);
export const Mail = wrap(Envelope);
export const Menu = wrap(List);
export const Minus = wrap(PMinus);
export const Monitor = wrap(PMonitor);
export const Moon = wrap(PMoon);
export const MoreVertical = wrap(DotsThreeVertical);
export const Pencil = wrap(PencilSimple);
export const Play = wrap(PPlay);
export const Plus = wrap(PPlus);
export const RefreshCw = wrap(ArrowsClockwise);
export const RotateCcw = wrap(ArrowCounterClockwise);
export const Search = wrap(MagnifyingGlass);
export const Send = wrap(PaperPlaneRight);
export const Settings = wrap(Gear);
export const Share2 = wrap(ShareNetwork);
export const Star = wrap(PStar);
export const Sun = wrap(PSun);
export const Trash2 = wrap(Trash);
export const User = wrap(PUser);
export const Users = wrap(PUsers);
export const X = wrap(PX);
