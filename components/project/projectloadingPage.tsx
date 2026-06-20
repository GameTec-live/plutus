import { Spinner } from "../ui/spinner";

export default function ProjectLoadingPage({ id }: { id?: string }) {
    return (
        <div className="flex items-center justify-center py-20" id={id}>
            <Spinner />
        </div>
    );
}
