import { cn } from "@/lib/utils";

function CardWrapper({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div className="bg-background w-full">
            <div
                data-slot="card-wrapper"
                className={cn(
                    "mx-auto grid min-h-screen w-full max-w-auto min-w-0 items-start gap-6 pt-2 sm:gap-8 sm:pt-6 sm:px-0 md:grid-cols-3 lg:grid-cols-3 md:gap-6 lg:pt-12 lg:px-0 2xl:max-w-6xl",

                    className,
                )}
                {...props}
            />
        </div>
    );
}

function ProjectCard({
    children,
    className,
    containerClassName,
    ...props
}: React.ComponentProps<"div"> & {
    title: string;
    containerClassName?: string;
}) {
    return (
        <div
            data-slot="example"
            className={cn(
                "mx-auto flex w-full min-w-0 flex-col gap-1 self-stretch",
                containerClassName,
            )}
            {...props}
        >
            <div
                data-slot="example-content"
                className={cn(
                    "bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 sm:p-6 *:[div:not([class*='w-'])]:w-full",
                    className,
                )}
            >
                {children}
            </div>
        </div>
    );
}

export { CardWrapper, ProjectCard };
