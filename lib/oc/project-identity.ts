export function slugifyProjectTitle(title: string) {
    const slug = title
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80)
        .replace(/-+$/g, "");
    return slug || "project";
}

export function getOpenCollectiveProjectIdentity(
    title: string,
    projectId: string,
) {
    return {
        name: `${title.trim()} · ${projectId.slice(0, 8)}`,
        slug: `${slugifyProjectTitle(title)}-${projectId.toLowerCase()}`,
    };
}
