import { SocketType } from '../plugin/typed-sockets';
import { Socket } from '../socket/Socket';
import { $socketcolor } from './vars';

export function assignColor(s: Socket): string {
	// if (s.required)
	// 	return '#b38a8a';
	const colorMap: { [key: SocketType]: string } = {
		string: '#d88cbb',
		pythonObject: '#616796',
		pythonProperty: '#949cd3'
	};
	return colorMap[s.type] || $socketcolor;
}
