import { NextRequest, NextResponse } from "next/server";
import { Gemini_Client } from "@/lib/gemini";
import * as fs from 'fs';
import path from 'path';
import os from 'os';

export async function POST(request: NextRequest) {
    // Xác định thư mục tạm thời đúng theo hệ điều hành
    const tempDir = os.tmpdir();

    try{
        const formData = await request.formData();
        const prompt = formData.get('prompt') as string;
        const imageFile = formData.get('image') as File;

        if (!prompt || !imageFile) {
            return NextResponse.json({ error: "Prompt và hình ảnh cần được cung cấp." }, { status: 400 });
        }

        // Lưu hình ảnh tải lên tạm thời
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const imagePath = path.join(tempDir, imageFile.name);
        fs.writeFileSync(imagePath, buffer);

        // Tạo instance của Gemini_Client
        const gemini = new Gemini_Client();

        // Tạo đối tượng phần hình ảnh theo tài liệu
        const imageMimeType = imageFile.type; // Lấy loại MIME từ tệp tải lên
        const imagePart = {
            inlineData: {
                data: buffer.toString("base64"),
                mimeType: imageMimeType
            },
        };

        // Gọi phương thức generateContent với prompt và hình ảnh
        const response = await gemini.generateContentWithImage(prompt, imagePart);
        if (imageFile) {
            const imagePath = path.join(tempDir, imageFile.name);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        return NextResponse.json({ response });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: "Lỗi khi tạo nội dung với hình ảnh." }, { status: 500 });
    }
}