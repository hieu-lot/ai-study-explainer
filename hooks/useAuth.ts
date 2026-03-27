"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth() {
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const isLoggedIn = typeof window !== "undefined" ? localStorage.getItem("isLoggedIn") : null;

        if (!isLoggedIn) {
            router.replace("/login");
        } else {
            setIsReady(true);
        }
    }, [router]);

    return isReady;
}
