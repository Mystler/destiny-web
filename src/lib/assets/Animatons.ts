import { quintOut } from "svelte/easing";
import { slide as sv_slide, fade as sv_fade } from "svelte/transition";

export const slide = (node: Element) => sv_slide(node, { easing: quintOut });
export const fade = (node: Element) => sv_fade(node, { easing: quintOut });
