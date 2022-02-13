// Core
import {FileUpload} from "graphql-upload";

export interface ICreateFileArgs {
    file: FileUpload;
}

export interface ICreateFileResponse {
    fileUrl: string;
    description: string;
}