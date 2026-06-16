export function Section({
    id,
    title,
    children,
}: {
    id: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="space-y-4 scroll-mt-24">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {title}
            </p>
            {children}
        </section>
    );
}
