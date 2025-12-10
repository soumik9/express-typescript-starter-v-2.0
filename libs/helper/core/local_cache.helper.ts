import NodeCache from "node-cache";
import httpStatus from "http-status";
import { ApiError, errorLogger } from "../../../config";
import { CacheTimeEnum } from "../../enum";

class LocalCacheService {
    private static instance: LocalCacheService;
    private cache: NodeCache;

    private constructor() {
        this.cache = new NodeCache({
            stdTTL: 0,
            checkperiod: 120,
            useClones: false,
        });
    }

    // Singleton instance
    public static getInstance(): LocalCacheService {
        if (!LocalCacheService.instance) {
            LocalCacheService.instance = new LocalCacheService();
        }
        return LocalCacheService.instance;
    }

    // Namespace
    private getNamespace() {
        return `telzen_${process.env.NODE_ENV}:`;
    }

    // ------------------ Set Multi ------------------
    public set(
        entries: { key: string; value: any; ttl?: number }[],
        defaultTtl: number = CacheTimeEnum.OneWeek
    ) {
        try {
            entries.forEach(({ key, value, ttl }) => {
                const namespacedKey = `${this.getNamespace()}${key}`;
                this.cache.set(namespacedKey, value, ttl ?? defaultTtl);
            });
        } catch (error) {
            const failed = entries.map((e) => e.key);
            errorLogger.error(`Local Cache: Failed to set keys: ${failed}`, error);
            throw new ApiError(
                httpStatus.INTERNAL_SERVER_ERROR,
                "Local Cache: Error setting values"
            );
        }
    }

    // ------------------ Get ------------------
    public get<T>(key: string): T | null {
        try {
            const namespacedKey = `${this.getNamespace()}${key}`;
            return this.cache.get<T>(namespacedKey) ?? null;
        } catch (error) {
            errorLogger.error(`Local Cache: Error getting key ${key}`, error);
            throw new ApiError(
                httpStatus.INTERNAL_SERVER_ERROR,
                "Local Cache: Error retrieving value"
            );
        }
    }

    // ------------------ Remove Keys ------------------
    public remove(keys: string[]) {
        try {
            const namespaced = keys.map((k) => `${this.getNamespace()}${k}`);
            this.cache.del(namespaced);
        } catch (error) {
            errorLogger.error(`Local Cache: Error removing keys ${keys}`, error);
            throw new ApiError(
                httpStatus.INTERNAL_SERVER_ERROR,
                "Local Cache: Error deleting keys"
            );
        }
    }

    // ------------------ Pattern Invalidate ------------------
    public invalidate(patterns: string | string[]) {
        try {
            const namespace = this.getNamespace();
            const patternArray = Array.isArray(patterns) ? patterns : [patterns];

            const allKeys = this.cache.keys();
            const toDelete: string[] = [];

            patternArray.forEach((pattern) => {
                const targetPrefix = namespace + pattern;

                allKeys.forEach((key) => {
                    if (key.startsWith(targetPrefix)) {
                        toDelete.push(key);
                    }
                });
            });

            if (toDelete.length) this.cache.del(toDelete);

        } catch (error) {
            errorLogger.error(
                `Local Cache: Error invalidating patterns ${patterns}`,
                error
            );
            throw new ApiError(
                httpStatus.INTERNAL_SERVER_ERROR,
                "Local Cache: Error invalidating keys"
            );
        }
    }

    // ------------------ Clear All ------------------
    public clearAll() {
        this.cache.flushAll();
    }

    // ------------------ get all keys ------------------
    public getAll(): Record<string, any> {
        try {
            const result: Record<string, any> = {};
            const keys = this.cache.keys();

            keys.forEach((key) => {
                result[key] = this.cache.get(key);
            });

            return result;
        } catch (error) {
            errorLogger.error("Local Cache: Error reading all cache", error);
            throw new ApiError(
                httpStatus.INTERNAL_SERVER_ERROR,
                "Local Cache: Error reading all cache entries"
            );
        }
    }

}

// Export singleton
export const LocalCache = LocalCacheService.getInstance();
