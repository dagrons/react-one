import { useApiConfig } from "@/context/ApiConfigContext";
import { createUserProfileApi } from "@/api/userProfileApi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UserListItem, UserProfileData } from "@/data/userProfile";

export const ALL_DEPARTMENTS_FILTER = "__ALL__";

interface UseUserProfileState {
    userList: UserListItem[];
    isUserListLoading: boolean;
    userListError: Error | null;
    selectedUserId: string | null;
    selectUser: (userId: string) => void;
    profile: UserProfileData | null;
    isProfileLoading: boolean;
    isRefreshing: boolean;
    profileError: Error | null;
    refreshProfile: () => Promise<void>;
    filteredUserList: UserListItem[];
    searchKeyword: string;
    searchInput: string;
    setSearchInput: (value: string) => void;
    departmentFilter: string;
    changeDepartmentFilter: (value: string) => void;
    departmentOptions: string[];
    resetFilters: () => void;
    submitSearch: () => void;
}

const applyFilters = (
    list: UserListItem[],
    keyword: string,
    department: string
): UserListItem[] => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return list.filter((item) => {
        const matchesKeyword =
            !normalizedKeyword || item.name.toLowerCase().includes(normalizedKeyword);
        const matchesDepartment =
            department === ALL_DEPARTMENTS_FILTER || item.department === department;
        return matchesKeyword && matchesDepartment;
    });
};

export const useUserProfile = (): UseUserProfileState => {
    const { apiBaseUrl } = useApiConfig();
    const api = useMemo(() => createUserProfileApi({ baseUrl: apiBaseUrl }), [apiBaseUrl]);

    const [userList, setUserList] = useState<UserListItem[]>([]);
    const [isUserListLoading, setIsUserListLoading] = useState(true);
    const [userListError, setUserListError] = useState<Error | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [profileError, setProfileError] = useState<Error | null>(null);
    const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [searchInput, setSearchInput] = useState<string>("");
    const [departmentFilter, setDepartmentFilter] = useState<string>(ALL_DEPARTMENTS_FILTER);

    const departmentOptions = useMemo(() => {
        const departments = new Set<string>();
        userList.forEach((item) => {
            if (item.department) {
                departments.add(item.department);
            }
        });
        return Array.from(departments).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
    }, [userList]);

    const filteredUserList = useMemo(
        () => applyFilters(userList, searchKeyword, departmentFilter),
        [departmentFilter, searchKeyword, userList]
    );

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const load = async () => {
            setIsUserListLoading(true);
            setUserListError(null);
            try {
                const list = await api.getUserList({ signal: controller.signal });
                if (!isMounted) return;
                setUserList(list);
                if (list.length && !selectedUserId) {
                    setSelectedUserId(list[0].id);
                } else if (selectedUserId && !list.some((item) => item.id === selectedUserId)) {
                    setSelectedUserId(list[0]?.id ?? null);
                }
            } catch (err) {
                if (!isMounted || (err instanceof DOMException && err.name === "AbortError")) {
                    return;
                }
                setUserListError(err as Error);
                setUserList([]);
            } finally {
                if (isMounted) {
                    setIsUserListLoading(false);
                }
            }
        };

        load();

        return () => {
            isMounted = false;
            controller.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api]);

    useEffect(() => {
        if (!userList.length) {
            setSelectedUserId(null);
            return;
        }
        setSelectedUserId((current) => {
            if (current && userList.some((item) => item.id === current)) {
                return current;
            }
            return userList[0]?.id ?? null;
        });
    }, [userList]);

    const loadProfile = useCallback(
        async (userId: string, { silent = false }: { silent?: boolean } = {}) => {
            const controller = new AbortController();
            setProfileError(null);
            setIsProfileLoading(!silent);
            setIsRefreshing(silent);
            if (!silent) {
                setProfile(null);
            }
            try {
                const result = await api.getUserProfile(userId, { signal: controller.signal });
                setProfile(result);
            } catch (err) {
                if (err instanceof DOMException && err.name === "AbortError") {
                    return;
                }
                setProfileError(err as Error);
                setProfile(null);
            } finally {
                setIsProfileLoading(false);
                setIsRefreshing(false);
            }
        },
        [api]
    );

    useEffect(() => {
        if (!selectedUserId) {
            setProfile(null);
            return;
        }
        const controller = new AbortController();
        setProfileError(null);
        setIsProfileLoading(true);
        setIsRefreshing(false);
        setProfile(null);

        api.getUserProfile(selectedUserId, { signal: controller.signal })
            .then((result) => {
                setProfile(result);
            })
            .catch((err) => {
                if (err instanceof DOMException && err.name === "AbortError") {
                    return;
                }
                setProfileError(err as Error);
                setProfile(null);
            })
            .finally(() => {
                setIsProfileLoading(false);
                setIsRefreshing(false);
            });

        return () => {
            controller.abort();
        };
    }, [api, selectedUserId]);

    const selectUser = useCallback((userId: string) => {
        setSelectedUserId(userId);
    }, []);

    const refreshProfile = useCallback(async () => {
        if (!selectedUserId) return;
        await loadProfile(selectedUserId, { silent: true });
    }, [loadProfile, selectedUserId]);

    const submitSearch = useCallback(() => {
        const appliedKeyword = searchInput.trim();
        setSearchKeyword(appliedKeyword);
        const matches = applyFilters(userList, appliedKeyword, departmentFilter);
        if (matches.length && !matches.some((item) => item.id === selectedUserId)) {
            setSelectedUserId(matches[0].id);
        }
    }, [departmentFilter, searchInput, selectedUserId, userList]);

    const changeDepartmentFilter = useCallback(
        (value: string) => {
            setDepartmentFilter(value);
            const matches = applyFilters(userList, searchKeyword, value);
            if (matches.length && !matches.some((item) => item.id === selectedUserId)) {
                setSelectedUserId(matches[0].id);
            }
        },
        [searchKeyword, selectedUserId, userList]
    );

    const resetFilters = useCallback(() => {
        setSearchInput("");
        setSearchKeyword("");
        setDepartmentFilter(ALL_DEPARTMENTS_FILTER);
        if (userList.length) {
            setSelectedUserId(userList[0].id);
        }
    }, [userList]);

    return {
        userList,
        isUserListLoading,
        userListError,
        selectedUserId,
        selectUser,
        profile,
        isProfileLoading,
        isRefreshing,
        profileError,
        refreshProfile,
        filteredUserList,
        searchKeyword,
        searchInput,
        setSearchInput,
        departmentFilter,
        changeDepartmentFilter,
        departmentOptions,
        resetFilters,
        submitSearch,
    };
};
