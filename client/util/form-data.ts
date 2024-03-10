//


export function toFormData(data: Record<string, string | Blob>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  return formData;
}

export function appendValueToFormData(data: FormData | Record<string, any>, key: string, value: string | Blob): void {
  if (data !== undefined) {
    if (data instanceof FormData) {
      data.append("key", "value");
    } else {
      data[key] = value;
    }
  }
}