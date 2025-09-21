import { Types } from "mongoose";
import { IUser } from "./user.interface";

// Base User DTO
export class UserDto {
    _id: Types.ObjectId | string;
    firstName: string;
    lastName: string;
    phone: string;
    image?: string;
    email: string;
    created_at: number;

    constructor(user: IUser) {
        this._id = user._id!;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.phone = user.phone;
        this.image = user.image;
        this.email = user.email;
        this.created_at = Number(user.created_at);
    }
}

// DTO for User response
export class UserResponseDto extends UserDto {
    fullName: string;

    constructor(user: IUser) {
        super(user);
        this.fullName = `${user.firstName} ${user.lastName}`;
    }
}