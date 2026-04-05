import { useMemo } from "react";
import { BASE_SIDEBAR_ITEMS, ADMIN_SIDEBAR_ITEMS, EDUCATION_SIDEBAR_ITEMS } from "./constants";

interface UseSidebarItemsProps {
    user: any;
    negocio?: any;
}

export function useSidebarItems({ user, negocio }: UseSidebarItemsProps) {
    const isEducation = useMemo(
        () => negocio?.rubro?.toLowerCase().includes("educacion") || negocio?.rubro?.toLowerCase().includes("academia"),
        [negocio?.rubro]
    );

    const isAdmin = useMemo(
        () => user?.rol === "admin_clickcito" || user?.rol === "admin",
        [user?.rol]
    );

    const isElys = useMemo(
        () => user?.id_negocio === "elysrestobar" || negocio?.id_negocio === "elysrestobar",
        [user?.id_negocio, negocio?.id_negocio]
    );

    const mainItems = useMemo(() => {
        const items = [...BASE_SIDEBAR_ITEMS];

        if (isAdmin) {
            items.push(...ADMIN_SIDEBAR_ITEMS.filter(i => i.id !== "productos_elys"));
        }

        if (isAdmin || isElys) {
            const elysItem = ADMIN_SIDEBAR_ITEMS.find(i => i.id === "productos_elys");
            if (elysItem) items.push(elysItem);
        }

        return items;
    }, [isAdmin, isElys]);

    const educationItems = useMemo(() => {
        return isEducation ? EDUCATION_SIDEBAR_ITEMS : [];
    }, [isEducation]);

    return { mainItems, educationItems, isEducation, isAdmin, isElys };
}
