import * as React from 'react';
import styled from 'styled-components';
import { $socketcolor, $socketsize } from './vars';
import type { Socket } from '../socket/Socket';
import { assignColor } from './utils';

interface StylesProps {
	borderColor: string;
	isRequired: boolean;
}

const Styles = styled.div<StylesProps>`
	display: inline-block;
	cursor: pointer;
	border: 4px dashed ${(props) => props.borderColor};
	width: ${$socketsize}px;
	height: ${$socketsize}px;
	vertical-align: middle;
	background: none;
	z-index: 2;
	box-sizing: border-box;
	&:hover {
		background: #ddd;
	}
	margin-left: 5px;
	margin-right: 6px;
`;

const RequiredStyles = styled(Styles)`
	border: 4px dashed #ff5b5b;

	// background: #f33;
`;

export function CustomArraySocket<T extends Socket>(props: { data: T }) {
	return (
		<Styles
			title={props.data.name}
			borderColor={assignColor(props.data)}
			isRequired={props.data.isRequired}
		/>
	);
}
