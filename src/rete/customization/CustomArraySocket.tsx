import * as React from 'react';
import styled from 'styled-components';
import { $socketcolor, $socketsize } from './vars';
import type { Socket } from '../socket/Socket';

const Styles = styled.div`
	display: inline-block;
	cursor: pointer;
	border: 4px dashed ${$socketcolor};
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
	if (props.data.isRequired) return <RequiredStyles title={props.data.name} />;
	else return <Styles title={props.data.name} />;
}
