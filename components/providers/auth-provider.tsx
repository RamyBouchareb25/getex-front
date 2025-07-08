"use client";
import { createContext, useContext, useEffect, ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<{}>({});

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "loading") return;

        // Check auth status on mount
        const checkAuthStatus = async () => {
            try {
                const response = await fetch("/api/auth/self");
                if (response.status === 401 && session) {
                    console.log("401 Unauthorized - Session expired or invalid");
                    await signOut();
                }
            } catch (error) {
                console.error("Error checking auth status:", error);
            }
        };

        checkAuthStatus();

        const originalFetch = window.fetch;

        window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            const response = await originalFetch(input, init);

            if (response.status === 401 && session) {
                console.log("401 Unauthorized - Session expired or invalid");
                await signOut();
            }

            return response;
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, [session, status]);

    return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
