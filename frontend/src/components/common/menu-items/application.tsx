// third-party
import { FormattedMessage } from 'react-intl';

import { NavItemType } from 'types';

// assets
import { IconApps, IconMap, IconMessages } from '@tabler/icons';

// constant
const icons = {
    IconApps,
    IconMessages,
    IconMap
};

// ==============================|| APPLICATION MENU ITEMS ||============================== //

const application: NavItemType = {
    id: 'application',
    title: <FormattedMessage id="application" />,
    icon: icons.IconApps,
    type: 'group',
    children: [
        {
            id: 'chat',
            title: <FormattedMessage id="chat" />,
            type: 'item',
            icon: icons.IconMessages,
            url: '/chat'
        },
        {
            id: 'map',
            title: <FormattedMessage id="map" />,
            type: 'item',
            icon: icons.IconMap,
            url: '/map'
        }
    ]
};

export default application;
