export function cn(classNames: (string | false | null | undefined)[] | string) {
  if (typeof classNames === "string") return classNames;
  return classNames.filter(Boolean).join(" ");
}
