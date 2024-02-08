// third-party
import { FormattedMessage } from 'react-intl';

import { NavItemType } from 'types';

// assets
import { IconApps, IconMap, IconMessages, IconChartBar, IconFileUpload } from '@tabler/icons';

// constant
const icons = {
    IconApps,
    IconMessages,
    IconMap,
    IconChartBar,
    IconFileUpload
};

// ==============================|| APPLICATION MENU ITEMS ||============================== //

const application: NavItemType = {
    id: 'application',
    title: <FormattedMessage id="application" />,
    icon: icons.IconApps,
    type: 'group',
    children: [
        {
            id: 'map',
            title: <FormattedMessage id="Map" />,
            type: 'item',
            icon: icons.IconMap,
            url: '/map'
        },
        {
            id: 'chat',
            title: <FormattedMessage id="Chat" />,
            type: 'item',
            icon: icons.IconMessages,
            url: '/chat',
            disabled: true
        },
        {
            id: 'graph',
            title: <FormattedMessage id="Graph" />,
            type: 'item',
            icon: icons.IconChartBar,
            url: '/graph',
            disabled: true
        },
        {
            id: 'doc-upload',
            title: <FormattedMessage id="doc-upload" />,
            type: 'item',
            icon: icons.IconFileUpload,
            url: '/doc-upload',
            disabled: true
        }
    ]
};

export default application;
