import dashboard from './dashboard';
import application from './application';
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
    items: [dashboard, application]
};

export default menuItems;
