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
	};

	return colorMap[s.type] || $socketcolor;
}
