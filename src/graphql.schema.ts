
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum CodeType {
    REGISTER = "REGISTER",
    LOGIN = "LOGIN",
    RESET = "RESET"
}

export class LoginInput {
    account: string;
    password: string;
    countryCode?: string;
}

export class SendValidateFromMailInput {
    imgCode: string;
    email: string;
    type?: CodeType;
}

export class RegisterInput {
    phoneNumber?: string;
    email?: string;
    password: string;
    countryCode?: string;
}

export class CreateCatInput {
    name?: string;
    age?: number;
}

export abstract class IQuery {
    abstract login(loginInput?: LoginInput): Login | Promise<Login>;

    abstract accessToken(refreshTokenInput?: string): Login | Promise<Login>;

    abstract logout(refreshTokenInput?: string): string | Promise<string>;

    abstract logoutFromAll(): string | Promise<string>;

    abstract sendValidateFromMail(sendValidateFromMailInput?: SendValidateFromMailInput): string | Promise<string>;

    abstract register(registerInput?: RegisterInput): string | Promise<string>;

    abstract getCats(): Cat[] | Promise<Cat[]>;

    abstract cat(id: string): Cat | Promise<Cat>;
}

export class Login {
    token?: string;
    refreshToken?: string;
    expiresIn?: number;
}

export abstract class IMutation {
    abstract createCat(createCatInput?: CreateCatInput): Cat | Promise<Cat>;
}

export abstract class ISubscription {
    abstract catCreated(): Cat | Promise<Cat>;
}

export class Cat {
    id?: number;
    name?: string;
    age?: number;
}
