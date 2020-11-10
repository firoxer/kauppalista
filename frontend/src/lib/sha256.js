export async function sha256(str) {
  const rawSha256 =
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  const hexSha256 =
    Array.from(new Uint8Array(rawSha256))
      .map((c) => c.toString(16).padStart(2, '0'))
      .join('');
  return hexSha256;
}