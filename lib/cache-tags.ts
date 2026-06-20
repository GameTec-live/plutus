export const cacheTags = {
    projects: {
        all: "projects",
        db: "projects:db",
        list: "projects:list",
        grid: "projects:grid",
        byId: (projectId: string) => `projects:${projectId}`,
        image: (projectId: string) => `projects:${projectId}:image`,
    },
    openCollective: {
        projectBalance: (slug: string) =>
            `open-collective:projects:${slug}:balance`,
    },
} as const;
