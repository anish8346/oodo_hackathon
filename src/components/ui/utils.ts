type ClassValue = string | number | null | undefined | false | ClassValue[];

function flattenClasses(inputs: ClassValue[]): string[] {
  const result: string[] = [];

  for (const value of inputs) {
    if (!value) {
      continue;
    }

    if (Array.isArray(value)) {
      result.push(...flattenClasses(value));
      continue;
    }

    result.push(String(value));
  }

  return result;
}

export function cn(...inputs: ClassValue[]) {
  return flattenClasses(inputs).join(" ");
}
