const buildFormData = (data: { [key: string]: any }) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        // If the value is an array, append each array item to the form data separately
        value.forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, value);
      }
    }
  }

  return formData;
}

export default buildFormData;