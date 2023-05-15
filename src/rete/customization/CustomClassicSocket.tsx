import * as React from 'react';
import type { ClassicPreset } from 'rete';
import styled from 'styled-components';

import { $socketcolor, $socketmargin, $socketsize } from './vars';
import type { Socket } from '../socket/Socket';

const Styles = styled.div`
	display: inline-block;
	cursor: pointer;
	border: 1px solid white;
	border-radius: ${$socketsize / 2.0}px;
	width: ${$socketsize}px;
	height: ${$socketsize}px;
	vertical-align: middle;
	background: ${$socketcolor};
	z-index: 2;
	box-sizing: border-box;
	&:hover {
		border-width: 4px;
	}
	&.multiple {
		border-color: yellow;
	}
`;

const Hoverable = styled.div`
	border-radius: ${($socketsize + $socketmargin * 2) / 2.0}px;
	padding: ${$socketmargin}px;
	&:hover ${Styles} {
		border-width: 4px;
	}
`;

const RequiredStyles = styled(Styles)`
	background: #b38a8a;
`;

export function CustomClassicSocket<T extends Socket>(props: { data: T }) {
	if (props.data.isRequired)
		return (
			<Hoverable>
				<RequiredStyles title={props.data.value ? String(props.data.value) : props.data.name} />
			</Hoverable>
		);
	else
		return (
			<Hoverable>
				<Styles title={props.data.value ? String(props.data.value) : props.data.name} />
			</Hoverable>
		);
}
