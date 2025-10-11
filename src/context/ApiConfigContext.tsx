import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

const STORAGE_KEY = "dgp-extend.apiBaseUrl";
const DEFAULT_BASE_URL = "mock://local";

interface ApiConfigContextValue {
    apiBaseUrl: string;
    setApiBaseUrl: (url: string) => void;
    resetApiBaseUrl: () => void;
}

const ApiConfigContext = createContext<ApiConfigContextValue | null>(null);

const readInitial = () => {
    if (typeof window === "undefined") {
        return DEFAULT_BASE_URL;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored?.trim() || DEFAULT_BASE_URL;
};

export const ApiConfigProvider = ({ children }: { children: ReactNode }) => {
    const [apiBaseUrl, setApiBaseUrlState] = useState<string>(readInitial);

    const setApiBaseUrl = useCallback((url: string) => {
        const normalized = url.trim() || DEFAULT_BASE_URL;
        setApiBaseUrlState(normalized);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, normalized);
        }
    }, []);

    const resetApiBaseUrl = useCallback(() => {
        setApiBaseUrl(DEFAULT_BASE_URL);
    }, [setApiBaseUrl]);

    const value = useMemo<ApiConfigContextValue>(
        () => ({
            apiBaseUrl,
            setApiBaseUrl,
            resetApiBaseUrl,
        }),
        [apiBaseUrl, resetApiBaseUrl, setApiBaseUrl]
    );

    return <ApiConfigContext.Provider value={value}>{children}</ApiConfigContext.Provider>;
};

export const useApiConfig = () => {
    const context = useContext(ApiConfigContext);
    if (!context) {
        throw new Error("useApiConfig 必须在 ApiConfigProvider 内使用");
    }
    return context;
};

export const getDefaultApiBaseUrl = () => DEFAULT_BASE_URL;
