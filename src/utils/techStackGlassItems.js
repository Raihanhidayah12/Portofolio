/** Map baris tech_stack → items untuk GlassIcons */

const GLASS_COLORS = ['cyan', 'blue', 'indigo', 'purple', 'green', 'orange', 'red'];

export function toGlassIconItems(techStacks) {
  return (techStacks ?? []).map((stack, index) => ({
    id: stack.id,
    iconUrl: stack.icon,
    color: GLASS_COLORS[index % GLASS_COLORS.length],
    label: stack.name,
  }));
}
