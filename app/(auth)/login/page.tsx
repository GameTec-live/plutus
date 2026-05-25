"Use client";

import Image from "next/image";
import Link from "next/link";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-medium"
                    >
                        <Image
                            alt="Plutus"
                            loading="eager"
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                            className="h-8 w-auto dark:hidden"
                            width={32}
                            height={32}
                        />
                        <Image
                            alt="Plutus"
                            loading="eager"
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                            className="h-8 w-auto not-dark:hidden"
                            width={32}
                            height={32}
                        />
                        <span className="hidden text-lg font-bold sm:block">
                            Plutus
                        </span>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <Image
                    src="/images/signup-img.jpg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] dark:grayscale"
                    width={600}
                    height={800}
                    loading="eager"
                />
            </div>
        </div>
    );
}
