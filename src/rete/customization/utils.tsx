import { SocketType } from '../plugin/typed-sockets';
import { Socket } from '../socket/Socket';
import { $socketcolor } from './vars';

export function assignColor(s: Socket): string {
	// if (s.required)
	// 	return '#b38a8a';
	const colorMap: { [key in SocketType]?: string } = {
		string: '#d88cbb',
		pythonObject: '#616796',
		pythonProperty: '#949cd3',
		number: '#d8b38c',
		boolean: '#d88c8c',
		solver: '#bc8cd8',
		output: '#d88c8c',
		fieldSpecification: '#8cd8b3',
		constitutive: '#8c8dd8',
		elementRegion: '#8cd8d8',
		numericalMethod: '#d8b78c',
		geometry: '#d8d08c',
		mesh: '#ad8c71',
	};

	return colorMap[s.type] || $socketcolor;
}
