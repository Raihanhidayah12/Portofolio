/** Map Supabase rows (snake_case) ↔ UI (PascalCase used in components). */

export function projectFromDb(row) {
  if (!row) return row;
  return {
    ...row,
    Title: row.title ?? row.Title ?? "",
    Description: row.description ?? row.Description ?? "",
    Img: row.img ?? row.Img ?? "",
    Link: row.link ?? row.Link ?? "",
    Github: row.github ?? row.Github ?? "",
    TechStack: row.tech_stack ?? row.TechStack ?? [],
    Features: row.features ?? row.Features ?? [],
  };
}

export function projectToDb({ Title, Description, Img, Link, Github, TechStack, Features }) {
  return {
    title: Title,
    description: Description,
    img: Img,
    link: Link,
    github: Github,
    tech_stack: TechStack,
    features: Features,
  };
}

export function certificateFromDb(row) {
  if (!row) return row;
  return {
    ...row,
    Img: row.img ?? row.Img ?? "",
  };
}

export function certificateToDb({ Img }) {
  return { img: Img };
}

export function mapProjects(rows) {
  return (rows ?? []).map(projectFromDb);
}

export function mapCertificates(rows) {
  return (rows ?? []).map(certificateFromDb);
}

export function resolveTechStackIcon(icon) {
  if (!icon) return "";
  if (icon.startsWith("http://") || icon.startsWith("https://") || icon.startsWith("/")) {
    return icon;
  }
  return `/${icon}`;
}

export function techStackFromDb(row) {
  if (!row) return row;
  const icon = row.icon ?? row.Icon ?? "";
  return {
    ...row,
    name: row.name ?? row.Name ?? "",
    icon: resolveTechStackIcon(icon),
    Language: row.name ?? row.Language ?? "",
    order_index: row.order_index ?? row.orderIndex ?? 0,
    is_published: row.is_published ?? row.isPublished ?? true,
  };
}

export function techStackToDb({ name, icon, order_index, is_published }) {
  return {
    name,
    icon,
    order_index: Number(order_index) || 0,
    is_published: is_published !== false,
  };
}

export function mapTechStack(rows) {
  return (rows ?? []).map(techStackFromDb);
}
