export default async function* report(events) {
  for await (const event of events) {
    yield JSON.stringify(event, (_key, value) =>
      value instanceof Error
        ? { name: value.name, message: value.message, stack: value.stack }
        : value,
    ) + "\n";
  }
}
