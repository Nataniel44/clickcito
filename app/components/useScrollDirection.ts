import { useState, useEffect } from "react";

interface UseScrollDirectionOptions {
    threshold?: number;
    hideThreshold?: number;
}

export function useScrollDirection({ threshold = 20, hideThreshold = 100 }: UseScrollDirectionOptions = {}) {
    const [scrolled, setScrolled] = useState(false);
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    setScrolled(currentScrollY > threshold);

                    if (currentScrollY < lastScrollY || currentScrollY < hideThreshold) {
                        setVisible(true);
                    } else if (currentScrollY > lastScrollY && currentScrollY > hideThreshold) {
                        setVisible(false);
                    }

                    setLastScrollY(currentScrollY);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY, threshold, hideThreshold]);

    return { scrolled, visible };
}
