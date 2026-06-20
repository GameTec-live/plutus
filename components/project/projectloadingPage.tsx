import { Spinner } from "../ui/spinner";

export default function ProjectLoadingPage() {
    return (
        <div className="flex items-center justify-center py-20">
            <Spinner />
        </div>
    );
}
