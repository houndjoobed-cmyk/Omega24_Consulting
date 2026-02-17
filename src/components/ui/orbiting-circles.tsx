import React from "react";
import { cn } from "./utils";

export interface OrbitingCirclesProps {
    className?: string;
    children?: React.ReactNode;
    reverse?: boolean;
    duration?: number;
    delay?: number;
    radius?: number;
    path?: boolean;
}

export default function OrbitingCircles({
    className,
    children,
    reverse,
    duration = 20,
    delay = 0,
    radius = 50,
    path = true,
}: OrbitingCirclesProps) {
    return (
        <>
            {path && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute inset-0 size-full"
                >
                    <circle
                        className="stroke-black/5 stroke-1 dark:stroke-white/5"
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="none"
                    />
                </svg>
            )}

            <div
                style={
                    {
                        "--duration": duration,
                        "--radius": radius,
                        "--delay": -delay,
                    } as React.CSSProperties
                }
                className={cn(
                    "absolute flex size-full transform-gpu animate-orbit items-center justify-center rounded-full border bg-black/10 [animation-delay:var(--delay)] dark:bg-white/10",
                    { "[animation-direction:reverse]": reverse },
                    className,
                )}
            >
                {children}
            </div>
        </>
    );
}
