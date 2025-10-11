import { mockUserProfileApi, UserProfileApi } from "./mockApiClient";
import { UserListItem, UserProfileData } from "@/data/userProfile";

export interface CreateUserProfileApiOptions {
    baseUrl: string;
}

const isMockBase = (baseUrl: string) => {
    return (
        baseUrl === "mock" ||
        baseUrl === "mock://" ||
        baseUrl.startsWith("mock://") ||
        baseUrl.startsWith("/mock")
    );
};

const createRealApiClient = (baseUrl: string): UserProfileApi => {
    const normalized = baseUrl.replace(/\/+$/, "");

    const buildUrl = (path: string) => `${normalized}${path}`;

    const fetchJson = async <T>(input: string, init?: RequestInit): Promise<T> => {
        const response = await fetch(input, {
            headers: {
                "Content-Type": "application/json",
                ...(init?.headers ?? {}),
            },
            ...init,
        });

        if (!response.ok) {
            throw new Error(`请求失败: ${response.status} ${response.statusText}`);
        }

        return response.json() as Promise<T>;
    };

    return {
        getUserList(options) {
            return fetchJson<UserListItem[]>(buildUrl("/user-profiles"), {
                signal: options?.signal,
            });
        },
        getUserProfile(userId, options) {
            return fetchJson<UserProfileData>(buildUrl(`/user-profiles/${userId}`), {
                signal: options?.signal,
            });
        },
    };
};

export const createUserProfileApi = ({ baseUrl }: CreateUserProfileApiOptions): UserProfileApi => {
    if (isMockBase(baseUrl)) {
        return mockUserProfileApi;
    }
    return createRealApiClient(baseUrl);
};

export type { UserProfileApi };
