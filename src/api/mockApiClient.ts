import {
    mockFetchUserList,
    mockFetchUserProfile,
    UserListItem,
    UserProfileData,
} from "@/data/userProfile";

export interface MockRequestOptions {
    signal?: AbortSignal;
}

export interface UserProfileApi {
    getUserList(options?: MockRequestOptions): Promise<UserListItem[]>;
    getUserProfile(userId: string, options?: MockRequestOptions): Promise<UserProfileData>;
}

const withSignal = async <T>(
    factory: () => Promise<T>,
    signal?: AbortSignal
): Promise<T> => {
    if (!signal) {
        return factory();
    }

    return Promise.race<T>([
        factory(),
        new Promise((_, reject) => {
            signal.addEventListener(
                "abort",
                () => reject(new DOMException("Aborted", "AbortError")),
                { once: true }
            );
        }) as Promise<T>,
    ]);
};

export const mockUserProfileApi: UserProfileApi = {
    async getUserList(options) {
        return withSignal(() => mockFetchUserList(), options?.signal);
    },
    async getUserProfile(userId, options) {
        return withSignal(() => mockFetchUserProfile(userId), options?.signal);
    },
};
