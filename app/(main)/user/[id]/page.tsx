import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPublicUserById } from "@/lib/db/queries/user";

export default async function UserProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const user = await getPublicUserById(id);

    return (
        <div className="flex flex-col mx-4 md:mx-16">
            <div className="mt-8 flex flex-col items-end">
                <Image
                    src={user.bannerImage || "/images/default-banner.jpg"}
                    alt="User Banner"
                    width={1920}
                    height={1080}
                    className="rounded-lg object-cover h-64"
                />
                <Avatar className="size-30 -mt-15 mr-8 md:mr-16">
                    <AvatarImage
                        src={user.image || undefined}
                        alt={user.name}
                    />
                    <AvatarFallback className="text-4xl">
                        {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="md:ml-10 lg:-mt-8">
                <h1 className="text-4xl">{user.name}</h1>
                <p className="text-lg text-muted-foreground whitespace-pre-wrap">
                    {user.bio || "No bio available."}
                </p>
            </div>
            <div className="mt-8 md:ml-10">
                <h2 className="text-2xl">{user.name}&apos;s Projects</h2>
            </div>
        </div>
    );
}
