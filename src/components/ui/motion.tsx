import React, { useEffect, useRef, useState } from 'react';
import { cn } from './utils';

interface UseInViewOptions extends IntersectionObserverInit {
    triggerOnce?: boolean;
}

export function useInView({ triggerOnce = true, ...options }: UseInViewOptions = {}) {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                if (triggerOnce) {
                    observer.disconnect();
                }
            } else {
                if (!triggerOnce) {
                    setIsInView(false);
                }
            }
        }, options);

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [triggerOnce, options.threshold, options.root, options.rootMargin]);

    return { ref, isInView };
}

interface FadeInProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    fullWidth?: boolean;
}

export function FadeIn({
    children,
    className,
    delay = 0,
    duration = 700,
    direction = 'up',
    fullWidth = false
}: FadeInProps) {
    const { ref, isInView } = useInView({ threshold: 0.1 });

    const getDirectionClasses = () => {
        switch (direction) {
            case 'up': return 'translate-y-8';
            case 'down': return '-translate-y-8';
            case 'left': return 'translate-x-8';
            case 'right': return '-translate-x-8';
            case 'none': return '';
            default: return 'translate-y-8';
        }
    };

    return (
        <div
            ref={ref}
            className={cn(
                "transition-all ease-out transform",
                isInView ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${getDirectionClasses()}`,
                fullWidth ? "w-full" : "",
                className
            )}
            style={{
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    );
}

export function StaggerContainer({
    children,
    className,
    delay = 0,
    staggerDelay = 100
}: {
    children: React.ReactNode,
    className?: string,
    delay?: number,
    staggerDelay?: number
}) {
    return (
        <div className={className}>
            {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, {
                        delay: delay + (index * staggerDelay)
                    });
                }
                return child;
            })}
        </div>
    );
}
