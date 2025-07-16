
'use server';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Ensure your environment variables are set up for AWS credentials and bucket details.
const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
});

/**
 * Uploads a file to an S3 bucket.
 * @param file The file object to upload.
 * @param fileName A unique name for the file in the bucket.
 * @returns The public URL of the uploaded file.
 */
export async function uploadFileToS3(file: File, fileName: string): Promise<string> {
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: fileName,
        Body: fileBuffer,
        ContentType: file.type,
    };

    const command = new PutObjectCommand(params);
    
    try {
        await s3Client.send(command);
        // Construct the public URL for the object.
        // This format works for public buckets. For private buckets, you'd generate a pre-signed URL.
        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;
        return fileUrl;
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        throw new Error("Failed to upload file.");
    }
}
