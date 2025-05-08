import { Types } from "mongoose";
import { IUser } from "./user.interface";

// Base User DTO
export class UserDto implements Partial<IUser> {
    _id: Types.ObjectId | string;
    firstName: string;
    lastName: string;
    phone: string;
    image?: string;
    email: string;
    createdAt: number | undefined;
    updatedAt: number | undefined;

    constructor(user: IUser) {
        this._id = user._id!;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.phone = user.phone;
        this.image = user.image;
        this.email = user.email;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
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
