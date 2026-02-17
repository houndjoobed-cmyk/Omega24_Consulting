import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "./utils";

interface NavItem {
    id: string;
    label: string;
    href: string;
}

interface PillNavProps {
    items: NavItem[];
    activeId: string;
    onItemClick?: (id: string) => void;
    className?: string;
}

export default function PillNav({ items, activeId, onItemClick, className }: PillNavProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const activeRef = useRef<HTMLAnchorElement>(null);
    const [activeRect, setActiveRect] = useState<{ left: number; width: number } | null>(null);

    useEffect(() => {
        if (activeRef.current && containerRef.current) {
            const activeElement = activeRef.current;

            const { offsetLeft, offsetWidth } = activeElement;
            setActiveRect({ left: offsetLeft, width: offsetWidth });
        }
    }, [activeId]);

    return (
        <nav
            ref={containerRef}
            className={cn(
                "relative flex items-center bg-white/5 backdrop-blur-md border border-white/10 p-1 rounded-full shadow-inner",
                className
            )}
        >
            {items.map((item) => {
                const isActive = activeId === item.id;
                return (
                    <a
                        key={item.id}
                        href={item.href}
                        ref={isActive ? activeRef : null}
                        onClick={(e) => {
                            if (onItemClick) {
                                e.preventDefault();
                                onItemClick(item.id);
                            }
                        }}
                        className={cn(
                            "relative z-10 px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full",
                            isActive ? "text-primary whitespace-nowrap" : "text-foreground/70 hover:text-foreground hover:bg-white/5 whitespace-nowrap"
                        )}
                    >
                        {item.label}
                    </a>
                );
            })}

            {activeRect && (
                <motion.div
                    className="absolute h-[calc(100%-8px)] rounded-full bg-white shadow-sm z-0"
                    initial={false}
                    animate={{
                        left: activeRect.left,
                        width: activeRect.width,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                    }}
                />
            )}
        </nav>
    );
}
