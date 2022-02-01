export const validateHex = (color: string): RegExpMatchArray | null => {
    return color.match(/[0-9A-Fa-f]{6}/g);
}