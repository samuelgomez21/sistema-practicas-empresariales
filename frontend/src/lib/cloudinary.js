/**
 * Sube un archivo a Cloudinary usando upload sin autenticación (unsigned).
 * Para documentos PDF/DOC necesitas crear un "upload preset" unsigned en el dashboard.
 */
const CLOUD_NAME   = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function subirArchivo(file, carpeta = 'practicas') {
  const formData = new FormData()
  formData.append('file',          file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder',        carpeta)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message ?? 'Error al subir archivo')
  }

  const data = await res.json()
  return data.secure_url  // URL pública del archivo
}