import { message } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import * as React from 'react';

export let messageApi: MessageInstance;

export function Message() {
    const [_messageApi, contextHolder] = message.useMessage();
    messageApi = _messageApi;

    return (
        <div>
            {contextHolder}
        </div>
    );

}