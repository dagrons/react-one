import { useEffect, useState } from "react";
import { fetchMockUserProfile, UserProfileData } from "@/data/userProfile";

interface UseMockUserProfileResult {
    data: UserProfileData | null;
    isLoading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
}

export const useMockUserProfile = (): UseMockUserProfileResult => {
    const [data, setData] = useState<UserProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const load = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchMockUserProfile();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("未知错误"));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const refresh = async () => {
        await load();
    };

    return { data, isLoading, error, refresh };
};
