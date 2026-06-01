/** Preset BorderGlow — selaras tema sky / zinc portfolio */

export const GLOW_MESH_COLORS = ["#38bdf8", "#818cf8", "#22d3ee"];

export const GLOW_CARD_PROPS = {
  glowColor: "199 89 48",
  backgroundColor: "rgba(9, 9, 11, 0.88)",
  borderRadius: 0,
  glowRadius: 32,
  glowIntensity: 0.95,
  edgeSensitivity: 26,
  coneSpread: 22,
  colors: GLOW_MESH_COLORS,
  fillOpacity: 0.38,
};

export const GLOW_BUTTON_PRIMARY_PROPS = {
  ...GLOW_CARD_PROPS,
  backgroundColor: "#0ea5e9",
  glowRadius: 20,
  edgeSensitivity: 32,
  glowIntensity: 1.1,
  fillOpacity: 0.28,
};

export const GLOW_BUTTON_SECONDARY_PROPS = {
  ...GLOW_CARD_PROPS,
  backgroundColor: "rgba(9, 9, 11, 0.92)",
  glowRadius: 20,
  edgeSensitivity: 32,
  fillOpacity: 0.32,
};

export const GLOW_CHIP_PROPS = {
  ...GLOW_CARD_PROPS,
  glowRadius: 14,
  edgeSensitivity: 38,
  fillOpacity: 0.25,
};
