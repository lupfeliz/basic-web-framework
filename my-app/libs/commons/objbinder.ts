function bindto<T>(o: T, p: any): T {
  for (const k in p) {
    (o as any)[k] = p[k]
  }
  return o
}

export { bindto }