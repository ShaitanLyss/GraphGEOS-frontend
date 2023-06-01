export class PythonObject {
	constructor(public readonly id: bigint) {}
}
export class PythonProperty {
	constructor(public readonly object: PythonObject, public readonly name: string) {}
}
