export const cacheTags = {
    projects: {
        all: "projects",
        db: "projects:db",
        list: "projects:list",
        grid: "projects:grid",
        byId: (projectId: string) => `projects:${projectId}`,
        image: (projectId: string) => `projects:${projectId}:image`,
        byUser: (userId: string) => `projects:user:${userId}`,
    },
    openCollective: {
        projectBalance: (id: string) =>
            `open-collective:projects:${id}:balance`,
    },
    users: {
        all: "users",
        profile: "users:profile",
        byId: (userId: string) => `users:${userId}`,
    },
} as const;
