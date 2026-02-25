import { createClient } from "@supabase/supabase-js";
import { ENV } from "./_core/env";

const supabase = createClient(
  ENV.supabaseUrl,
  ENV.supabaseServiceRoleKey
);

/**
 * Upload de arquivo para Supabase Storage
 * @param bucket Nome do bucket (ex: 'reports', 'complaints')
 * @param filePath Caminho do arquivo (ex: 'reports/2026-02-25/decreto-123.pdf')
 * @param fileBuffer Buffer do arquivo
 * @param contentType Tipo MIME (ex: 'application/pdf')
 * @returns URL pública do arquivo
 */
export async function uploadFile(
  bucket: string,
  filePath: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Gerar URL pública
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("[Storage] Upload error:", error);
    throw error;
  }
}

/**
 * Deletar arquivo do Supabase Storage
 */
export async function deleteFile(bucket: string, filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error("[Storage] Delete error:", error);
    throw error;
  }
}

/**
 * Listar arquivos em um bucket
 */
export async function listFiles(
  bucket: string,
  path: string = ""
): Promise<Array<{ name: string; id: string; updated_at: string }>> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path, {
        limit: 100,
        offset: 0,
        sortBy: { column: "updated_at", order: "desc" },
      });

    if (error) {
      throw new Error(`List failed: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("[Storage] List error:", error);
    throw error;
  }
}
