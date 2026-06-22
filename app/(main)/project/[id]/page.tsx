import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { FundingProgress } from "@/components/project/fundingProgress";
import { OpenCollectiveDonationEmbed } from "@/components/project/openCollectiveDonationEmbed";
import { ProjectImageCarousel } from "@/components/project/projectImageCarousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cacheTags } from "@/lib/cache-tags";
import { getProjectWithBalance } from "@/lib/connected-db-oc/project";
import { getProjectById } from "@/lib/db/queries/project";
import { getOpenCollectiveWebUrl } from "@/lib/oc/url";

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    "use cache";
    cacheLife("minutes");

    const { id } = await params;

    if (!z.uuid().safeParse(id).success) {
        notFound();
    }

    cacheTag(cacheTags.projects.all, cacheTags.projects.byId(id));

    const projectData = await getProjectById(id);

    if (!projectData) {
        notFound();
    }

    const project = await getProjectWithBalance(projectData);

    const openCollectiveBaseUrl = getOpenCollectiveWebUrl();
    const embedUrl = project.openCollectiveID
        ? new URL(
              `/embed/${encodeURIComponent(project.openCollectiveID)}/donate`,
              openCollectiveBaseUrl,
          ).toString()
        : null;

    return (
        <main className="w-full px-4 py-6 sm:px-5 lg:min-h-[calc(100dvh-11.5rem)] lg:px-6">
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,1.15fr)_minmax(20rem,1fr)] lg:gap-6">
                <div className="lg:sticky lg:top-22 lg:self-start">
                    <ProjectImageCarousel
                        images={project.images}
                        projectTitle={project.title}
                    />
                </div>

                <article className="min-w-0 lg:pr-2">
                    <h1 className="wrap-anywhere text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                        {project.title}
                    </h1>
                    <p className="mt-3 wrap-anywhere text-base text-muted-foreground sm:text-lg">
                        {project.shortDescription}
                    </p>

                    <FundingProgress
                        goals={project.goals}
                        balanceInCents={project.balanceInCents}
                        currency={project.currency}
                        className="mt-6"
                    />

                    <Link
                        href={`/user/${project.creator.id}`}
                        className="mt-6 flex w-fit max-w-full items-center gap-3 rounded-lg p-1.5 pr-3 transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <Avatar size="lg">
                            <AvatarImage
                                src={project.creator.image || undefined}
                                alt={project.creator.name}
                            />
                            <AvatarFallback>
                                {project.creator.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="min-w-0">
                            <span className="block text-xs text-muted-foreground">
                                Created by
                            </span>
                            <span className="block truncate text-sm font-medium">
                                {project.creator.name}
                            </span>
                        </span>
                    </Link>

                    <div className="my-6 h-px bg-border" />

                    <section aria-labelledby="about-project-title">
                        <h2
                            id="about-project-title"
                            className="text-xl font-semibold"
                        >
                            About this project
                        </h2>
                        <p className="mt-4 wrap-anywhere whitespace-pre-wrap text-sm leading-7 text-foreground/90 sm:text-base">
                            {project.longDescription?.trim() ||
                                "No additional project description has been provided."}
                        </p>
                    </section>
                </article>

                <OpenCollectiveDonationEmbed
                    projectId={project.id}
                    projectTitle={project.title}
                    embedUrl={embedUrl}
                    embedOrigin={openCollectiveBaseUrl.origin}
                />
            </div>
        </main>
    );
}
