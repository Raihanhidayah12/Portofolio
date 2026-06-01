/** Map baris tech_stack → items untuk LogoLoop */

export function toLogoLoopItems(techStacks) {
  return (techStacks ?? []).map((stack) => ({
    src: stack.icon,
    alt: stack.name,
    title: stack.name,
  }));
}
