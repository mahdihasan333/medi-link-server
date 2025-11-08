const pick = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Partial<T> => {
    const finalObject: Partial<T> = {}

    

    return finalObject;
}

export default pick;