export type Category = ICategory;
export type Tag = ITag;
export type Pet = IPet;
export type UpdatePetWithForm = IUpdatePetWithForm;
export type UploadFile = IUploadFile;
export type ApiResponse = IApiResponse;
export type GetInventory = IGetInventory;
export type Order = IOrder;
export type User = IUser;

export type PetStatus = "available" | "pending" | "sold" ;
export type Status = "available" | "pending" | "sold" ;
export type OrderStatus = "placed" | "approved" | "delivered" ;

export interface ICategory {
    id?: number;
    name?: string;
}

export interface ITag {
    id?: number;
    name?: string;
}

export interface IPet {
    id?: number;
    Category?: ICategory;
    name: string;
    photoUrls: string[];
    Tag?: ITag[];
    status?: PetStatus;
}

export interface IUpdatePetWithForm {
    name?: string;
    status?: string;
}

export interface IUploadFile {
    additionalMetadata?: string;
    file?: Blob;
}

export interface IApiResponse {
    code?: number;
    type?: string;
    message?: string;
}

export interface IGetInventory {
    [id: string]: number;
}

export interface IOrder {
    id?: number;
    petId?: number;
    quantity?: number;
    shipDate?: Date;
    status?: OrderStatus;
    complete?: boolean;
}

export interface IUser {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    userStatus?: number;
}

export interface FindPetsByStatusParameters {
    status: Status[];
}

export interface FindPetsByTagsParameters {
    tags: string[];
}

export interface GetPetByIdParameters {
    petId: number;
}

export interface UpdatePetWithFormParameters {
    petId: number;
}

export interface DeletePetParameters {
    api_key?: string;
    petId: number;
}

export interface UploadFileParameters {
    petId: number;
}

export interface GetOrderByIdParameters {
    orderId: number;
}

export interface DeleteOrderParameters {
    orderId: number;
}

export interface LoginUserParameters {
    username: string;
    password: string;
}

export interface GetUserByNameParameters {
    username: string;
}

export interface UpdateUserParameters {
    username: string;
}

export interface DeleteUserParameters {
    username: string;
}

