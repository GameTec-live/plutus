"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";

const Tooltip = PopoverPrimitive.Root;

function TooltipTrigger(props: PopoverPrimitive.Trigger.Props) {
    return <PopoverPrimitive.Trigger openOnHover delay={150} {...props} />;
}

function TooltipContent({
    className,
    side = "top",
    sideOffset = 6,
    children,
    ...props
}: PopoverPrimitive.Popup.Props &
    Pick<PopoverPrimitive.Positioner.Props, "side" | "sideOffset">) {
    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Positioner
                side={side}
                sideOffset={sideOffset}
                className="z-50"
            >
                <PopoverPrimitive.Popup
                    data-slot="tooltip-content"
                    className={cn(
                        "z-50 max-w-72 origin-(--transform-origin) rounded-lg bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
                        className,
                    )}
                    {...props}
                >
                    {children}
                    <PopoverPrimitive.Arrow className="fill-popover" />
                </PopoverPrimitive.Popup>
            </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
    );
}

export { Tooltip, TooltipContent, TooltipTrigger };
