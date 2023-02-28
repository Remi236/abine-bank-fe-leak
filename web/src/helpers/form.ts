export const removeEmptyValueKey = (obj: object) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v != ''));
