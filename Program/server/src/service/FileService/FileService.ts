// Core
import * as fs from "fs";
import path from "path";
import {ApolloError} from "apollo-server-express";
import {createWriteStream} from "fs";
import {v4} from "uuid";

// Types
import {Errors} from "../../types";

// Args
import {ICreateFileArgs, ICreateFileResponse} from "./agrs";

class FileService {
    create({file}: ICreateFileArgs): ICreateFileResponse {
        try {
            const fileName: string = v4() + file.filename;
            const filePath: string = path.resolve(__dirname, '../../', 'static');

            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true});
            }

            const fileUrl: string = path.resolve(filePath, fileName);

            file.createReadStream()
                .pipe(createWriteStream(fileUrl));

            return {fileUrl, description: file.filename};
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }
}

export default new FileService();