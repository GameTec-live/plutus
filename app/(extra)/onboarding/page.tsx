import { CircleDollarSign, HandHelping, X } from "lucide-react";
import Link from "next/link";

export default function Page() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center">
            <Link
                href="/"
                className="absolute top-5 right-5 hover:text-muted-foreground"
            >
                <X />
            </Link>
            <div className="max-h-1/2 h-full w-full flex flex-col items-center justify-between">
                <h1 className="text-2xl md:text-4xl font-bold">
                    What will you use Plutus for?
                </h1>
                <div className="flex flex-row w-full items-center justify-evenly gap-4 px-4">
                    <Link
                        href="/#explore"
                        className="ring-foreground/10 bg-card text-card-foreground overflow-hidden rounded-xl py-4 text-sm ring-1 flex flex-col items-center justify-center gap-4 w-full max-w-xs aspect-square hover:bg-muted"
                    >
                        <CircleDollarSign className="size-3/4 text-primary" />
                        <h2 className="text-lg md:text-3xl">
                            Supporting projects
                        </h2>
                    </Link>

                    <Link
                        href="/create"
                        className="ring-foreground/10 bg-card text-card-foreground overflow-hidden rounded-xl py-4 text-sm ring-1 flex flex-col items-center justify-center gap-4 w-full max-w-xs aspect-square hover:bg-muted"
                    >
                        <HandHelping className="size-3/4 text-accent-foreground" />
                        <h2 className="text-lg md:text-3xl">Receive support</h2>
                    </Link>
                </div>
            </div>
        </div>
    );
}
