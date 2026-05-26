-- ==========================================
-- SCRIPT DE CREACIÓN DE BUCKET AFIP (SECURE)
-- ==========================================
-- Este script crea el bucket 'afip_certs' en Supabase Storage
-- para alojar los archivos .crt y .key de las empresas.
-- Está configurado con RLS (Row Level Security) estricto.

-- 1. Insertar el bucket (Privado)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('afip_certs', 'afip_certs', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Habilitar RLS en objetos de storage (si no está habilitado)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS DE SEGURIDAD (Row Level Security)
-- a) Política para que un usuario pueda subir certificados SÓLO a la carpeta de su empresa.
-- Se asume que la ruta del archivo será: afip_certs/[empresa_id]/certificado.crt
CREATE POLICY "Empresas can upload their own certs" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
    bucket_id = 'afip_certs' 
    AND (storage.foldername(name))[1] = (
        SELECT empresa_id::text FROM public.usuarios WHERE id = auth.uid() LIMIT 1
    )
);

-- b) Política para leer (El servidor o el usuario de la empresa)
CREATE POLICY "Empresas can view their own certs" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (
    bucket_id = 'afip_certs' 
    AND (storage.foldername(name))[1] = (
        SELECT empresa_id::text FROM public.usuarios WHERE id = auth.uid() LIMIT 1
    )
);

-- c) Política para eliminar/actualizar (Sólo dueños de la empresa)
CREATE POLICY "Empresas can update their own certs" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (
    bucket_id = 'afip_certs' 
    AND (storage.foldername(name))[1] = (
        SELECT empresa_id::text FROM public.usuarios WHERE id = auth.uid() LIMIT 1
    )
);

CREATE POLICY "Empresas can delete their own certs" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (
    bucket_id = 'afip_certs' 
    AND (storage.foldername(name))[1] = (
        SELECT empresa_id::text FROM public.usuarios WHERE id = auth.uid() LIMIT 1
    )
);
