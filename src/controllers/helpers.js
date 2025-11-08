
export const handleZod = (schema, data) => {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const msg = parsed.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join(', ');
    const e = new Error(msg); e.status = 400; throw e;
  }
  return parsed.data;
};
