import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ success: true, files: [] });
    }

    const files = fs.readdirSync(uploadDir);
    const fileUrls = files.map((file) => `/uploads/${file}`);

    return NextResponse.json({ success: true, files: fileUrls });
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers:', error);
    return NextResponse.json({ success: false, message: 'Error retrieving files' });
  }
}
