export function containsArr<Type>(fromArray: Array<Type>, toArray: Array<Type>): boolean {
    for (let i = 0; i < fromArray.length; i++) {
        if (!toArray.includes(fromArray[i])) {
            return false;
        }
    }
    return true;
}