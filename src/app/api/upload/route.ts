import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uploadPurpose = formData.get('uploadPurpose') as string;
    const bucketName = formData.get('bucketName') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!uploadPurpose || !bucketName) {
      return NextResponse.json({ error: 'Upload purpose and bucket name are required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size too large. Maximum 5MB allowed.' }, { status: 400 });
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const filePath = `${uploadPurpose}/${uniqueFilename}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    // Save file record to database
    const { data: fileRecord, error: dbError } = await supabase
      .from('file_uploads')
      .insert({
        filename: uniqueFilename,
        original_filename: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        bucket_name: bucketName,
        uploaded_by: session.user.id,
        upload_purpose: uploadPurpose,
        metadata: {
          public_url: publicUrl
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Try to clean up uploaded file
      await supabase.storage.from(bucketName).remove([filePath]);
      return NextResponse.json({ error: 'Failed to save file record' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      file: {
        id: fileRecord.id,
        filename: fileRecord.filename,
        originalFilename: fileRecord.original_filename,
        publicUrl: publicUrl,
        filePath: filePath,
        fileSize: fileRecord.file_size,
        mimeType: fileRecord.mime_type,
        uploadPurpose: fileRecord.upload_purpose
      }
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    // Get file record
    const { data: fileRecord, error: fetchError } = await supabase
      .from('file_uploads')
      .select('*')
      .eq('id', fileId)
      .single();

    if (fetchError || !fileRecord) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(fileRecord.bucket_name)
      .remove([fileRecord.file_path]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('file_uploads')
      .delete()
      .eq('id', fileId);

    if (dbError) {
      console.error('Database deletion error:', dbError);
      return NextResponse.json({ error: 'Failed to delete file record' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'File deleted successfully' });

  } catch (error) {
    console.error('Delete API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}