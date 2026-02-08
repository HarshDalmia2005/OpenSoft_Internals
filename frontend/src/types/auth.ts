export type AuthMode = 'login' | 'signup';

export interface AuthFormData {
    email: string;
    password: string;
    name?: string;
    confirmPassword?: string;
}