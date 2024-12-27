
export default function omit(obj: any, key: string | string[]) {

  if (!Array.isArray(key) && typeof key === 'string') {
    key = [key];
  }

  const keys = new Set(key);
  const result: any = {};
  for (const k in obj) {
    if (!keys.has(k)) {
      result[k] = obj[k];
    }
  }
  return result;
}