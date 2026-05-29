export function renameFile(file: File, prefix: string): File {
  const ext = file.name.split(".").pop() || "jpg";
  return new File([file], `${prefix}.${ext}`, { type: file.type });
}
