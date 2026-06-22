"use client";

import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import Image from "next/image";
import {
    type KeyboardEvent as ReactKeyboardEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { cn } from "@/lib/utils";

type CarouselImage = {
    id: string;
    url: string;
    isPrimary: boolean;
};

type ProjectImageCarouselProps = {
    images: CarouselImage[];
    projectTitle: string;
};

const fallbackImage: CarouselImage = {
    id: "default-project-image",
    url: "/images/default-banner.png",
    isPrimary: true,
};

function isEditableTarget(target: EventTarget | null) {
    return (
        target instanceof HTMLElement &&
        Boolean(
            target.closest("input, textarea, select, [contenteditable='true']"),
        )
    );
}

export function ProjectImageCarousel({
    images,
    projectTitle,
}: ProjectImageCarouselProps) {
    const availableImages = useMemo(
        () => (images.length > 0 ? images : [fallbackImage]),
        [images],
    );
    const primaryImageIndex = Math.max(
        0,
        availableImages.findIndex((image) => image.isPrimary),
    );
    const [selectedIndex, setSelectedIndex] = useState(primaryImageIndex);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const hasMultipleImages = availableImages.length > 1;

    const selectPrevious = useCallback(() => {
        setSelectedIndex(
            (currentIndex) =>
                (currentIndex - 1 + availableImages.length) %
                availableImages.length,
        );
    }, [availableImages.length]);

    const selectNext = useCallback(() => {
        setSelectedIndex(
            (currentIndex) => (currentIndex + 1) % availableImages.length,
        );
    }, [availableImages.length]);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (!hasMultipleImages || isEditableTarget(event.target)) {
                return;
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                selectPrevious();
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                selectNext();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [hasMultipleImages, selectNext, selectPrevious]);

    const selectedImage = availableImages[selectedIndex];
    const selectedImageAlt = `${projectTitle}, image ${selectedIndex + 1} of ${availableImages.length}`;

    function openLightbox() {
        dialogRef.current?.showModal();
    }

    function closeLightbox() {
        dialogRef.current?.close();
    }

    function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLDialogElement>) {
        if (event.key === "Escape") {
            event.stopPropagation();
            closeLightbox();
        }
    }

    return (
        <section aria-label={`${projectTitle} image gallery`}>
            <div className="relative overflow-hidden rounded-xl border bg-muted/30 shadow-sm">
                <button
                    type="button"
                    className="relative block aspect-4/3 w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                    onClick={openLightbox}
                    aria-label={`Enlarge ${selectedImageAlt}`}
                >
                    <Image
                        src={selectedImage.url}
                        alt={selectedImageAlt}
                        fill
                        priority
                        sizes="(min-width: 1024px) 38vw, 100vw"
                        className="object-contain"
                    />
                </button>

                {hasMultipleImages ? (
                    <>
                        <button
                            type="button"
                            onClick={selectPrevious}
                            className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-foreground shadow-md backdrop-blur-sm transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label="Show previous image"
                        >
                            <ChevronLeftIcon aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={selectNext}
                            className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-foreground shadow-md backdrop-blur-sm transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label="Show next image"
                        >
                            <ChevronRightIcon aria-hidden="true" />
                        </button>
                    </>
                ) : null}

                <span className="absolute right-3 bottom-3 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
                    {selectedIndex + 1} / {availableImages.length}
                </span>
            </div>

            {images.length > 0 ? (
                <fieldset
                    className="mt-3 flex min-w-0 gap-3 overflow-x-auto pb-2"
                    aria-label="Choose project image"
                >
                    {availableImages.map((image, index) => (
                        <button
                            key={image.id}
                            type="button"
                            onClick={() => setSelectedIndex(index)}
                            aria-label={`Show image ${index + 1} of ${availableImages.length}`}
                            aria-current={
                                index === selectedIndex ? "true" : undefined
                            }
                            className={cn(
                                "relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                index === selectedIndex
                                    ? "border-primary"
                                    : "border-transparent opacity-70 hover:opacity-100",
                            )}
                        >
                            <Image
                                src={image.url}
                                alt=""
                                fill
                                sizes="80px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </fieldset>
            ) : null}

            <dialog
                ref={dialogRef}
                onKeyDown={handleDialogKeyDown}
                onClick={(event) => {
                    if (event.target === event.currentTarget) {
                        closeLightbox();
                    }
                }}
                className="m-auto h-full max-h-none w-full max-w-none border-0 bg-transparent p-4 text-foreground backdrop:bg-black/85 open:flex open:items-center open:justify-center"
                aria-label={`${projectTitle} enlarged image`}
            >
                <div className="relative h-full max-h-[90dvh] w-full max-w-7xl">
                    <Image
                        src={selectedImage.url}
                        alt={selectedImageAlt}
                        fill
                        sizes="100vw"
                        className="object-contain"
                    />
                    <button
                        type="button"
                        onClick={closeLightbox}
                        className="absolute top-2 right-2 z-10 grid size-11 place-items-center rounded-full bg-background/90 text-foreground shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label="Close enlarged image"
                    >
                        <XIcon aria-hidden="true" />
                    </button>
                    {hasMultipleImages ? (
                        <>
                            <button
                                type="button"
                                onClick={selectPrevious}
                                className="absolute top-1/2 left-2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                aria-label="Show previous enlarged image"
                            >
                                <ChevronLeftIcon aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={selectNext}
                                className="absolute top-1/2 right-2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                aria-label="Show next enlarged image"
                            >
                                <ChevronRightIcon aria-hidden="true" />
                            </button>
                        </>
                    ) : null}
                </div>
            </dialog>
        </section>
    );
}
