// @helper: Transform a possibly populated property to either its ID or a simplified object
export function transformPopolatedProperty<T extends object, K extends keyof T>(
    obj: T,
    propertyName: K,
    keyExtractor: (value: any) => object
): T[K] | object {
    const propertyValue = obj[propertyName];
    if (propertyValue && typeof propertyValue === "object" && "_id" in propertyValue && Object.keys(propertyValue).length > 1) {
        return keyExtractor(propertyValue);
    }
    return propertyValue;
}

export const formatFloatingNumber = (num: number) => Number(num.toFixed(2));