export default function readProp(maybeObject: unknown, key: string): unknown {
	if (!(maybeObject && typeof maybeObject === "object")) return undefined;

	return maybeObject[key as keyof typeof maybeObject];
}
