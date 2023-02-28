export const id = (route: string, id?: number | string) =>
  route.replace(/:id/g, typeof id === "string" ? id : Number(id).toString());
export const params = (route: string, query: {[key: string]: any}) => {
  const str = [];
  for (const p in query) {
    if (Object.hasOwn(query, p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(query[p]));
    }
  }
  return `${route}?${str.join("&")}`;
}
