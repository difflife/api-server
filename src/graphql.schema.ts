
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class LoginInput {
    account: string;
    password: string;
    countryCode?: string;
}

export class CreateCatInput {
    name?: string;
    age?: number;
}

export abstract class IQuery {
    abstract login(loginInput?: LoginInput): Login | Promise<Login>;

    abstract accessToken(refreshToken?: string): Login | Promise<Login>;

    abstract logout(refreshToken?: string): string | Promise<string>;

    abstract logoutFromAll(): string | Promise<string>;

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
