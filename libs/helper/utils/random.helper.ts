// @helper: generate random password
export const generateRandomPassword = async (length: number): Promise<string> => {
    if (length <= 0) {
        throw new Error("Password length must be greater than 0");
    }

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    return password;
};

// @helper: generate random number
export const generateRandomCode = async (length: number): Promise<number> => {
    if (length <= 0) throw new Error("Length must be greater than 0");
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(min + Math.random() * (max - min + 1));
};