import { Card, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function ProjectCardSkeleton({
    showProgress = true,
}: {
    showProgress?: boolean;
}) {
    return (
        <Card
            className="relative w-full max-w-sm overflow-hidden pt-0"
            aria-hidden="true"
        >
            <Skeleton className="aspect-video w-full rounded-none rounded-t-xl" />
            <CardHeader>
                <Skeleton className="h-5.5 w-3/4" />
                <Skeleton className="h-5 w-full" />
            </CardHeader>
            {showProgress && (
                <CardFooter>
                    <div className="flex w-full max-w-sm flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-3.5 w-28" />
                            <Skeleton className="ml-auto h-3.5 w-16" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}
