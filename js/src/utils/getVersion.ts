function getVersion(): string {
  return String(import.meta.env?.VITE_SATTRACK_VERSION) ?? "no_version";
}

export default getVersion;