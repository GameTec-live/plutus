import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export function ProjectMarkdown({
    children,
    className,
}: {
    children: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "wrap-anywhere space-y-4 text-sm leading-7 text-foreground/90 sm:text-base [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_table]:block [&_table]:overflow-x-auto [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_ul]:list-disc",
                className,
            )}
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {children}
            </ReactMarkdown>
        </div>
    );
}
