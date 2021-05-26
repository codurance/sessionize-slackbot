export function deepFilterFor<T>(itemToExclude: T, array: T[]): T[] {
    return array.filter(value => JSON.stringify(value) !== JSON.stringify(itemToExclude));
}