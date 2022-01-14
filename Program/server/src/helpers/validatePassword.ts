export const validatePassword = (password: string): RegExpMatchArray | null => {
    return password.match(/^(?=.*[0-9])(?=.*[a-z])(?=\S+$).{5,}$/);
}