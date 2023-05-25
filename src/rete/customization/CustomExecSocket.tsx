import * as React from 'react';
import styled from 'styled-components';

import { $socketcolor, $socketmargin, $socketsize } from './vars';
import type { Socket } from '../socket/Socket';

const InnerTriangle = styled.div`
	position: relative;
	height: 0;
	width: 0;
	top: -13px;
	left: -26px;
	border-top: 14px solid transparent;
	border-bottom: 14px solid transparent;
	border-left: 24px solid #b479b6;
	display: inline-block;
	cursor: pointer;
	/*width: ${$socketsize}px;
	height: ${$socketsize}px;*/
	vertical-align: middle;

	/* background: ${$socketcolor}; */
	z-index: 2;
	box-sizing: border-box;
	&:hover {
		top: -11px;
		left: -24px;
		border-top: 10px solid transparent;
		border-bottom: 10px solid transparent;
		border-left: 17px solid #b479b6;
	}
	&.multiple {
		border-color: yellow;
	}
`;

const OuterTriangle = styled.div`
	height: 0;
	width: 0;
	display: inline-block;
	border-top: 16px solid transparent;
	border-bottom: 16px solid transparent;
	padding-left: -10px;
	border-left: 28px solid white;
	&:hover ${InnerTriangle} {
		top: -11px;
		left: -24px;
		border-top: 10px solid transparent;
		border-bottom: 10px solid transparent;
		border-left: 17px solid #b479b6;
	}
`;

const RequiredStyles = styled(InnerTriangle)`
	background: #b38a8a;
`;

export function CustomExecSocket<T extends Socket>(props: { data: T }) {
	return (

		<OuterTriangle>
			<InnerTriangle title={props.data.value ? String(props.data.value) : props.data.name} />
		</OuterTriangle>

	);
}
