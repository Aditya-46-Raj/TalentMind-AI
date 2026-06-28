import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary =
    (buffer) => {
        return new Promise(
            (resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        {
                            resource_type:
                                "raw",
                            folder:
                                "talentmind/resumes",
                        },
                        (
                            error,
                            result
                        ) => {
                            if (error)
                                reject(error);
                            else
                                resolve(result);
                        }
                    )
                    .end(buffer);
            }
        );
    };

export {
    uploadToCloudinary,
};