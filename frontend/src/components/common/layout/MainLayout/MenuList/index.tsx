import { memo, useEffect } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Divider, List, Typography, useMediaQuery } from "@mui/material";

// project imports
import NavItem from "./NavItem";
import NavGroup from "./NavGroup";

import menuItem from "components/common/menu-items";
import useConfig from "hooks/useConfig";
import { Menu } from "components/common/menu-items/widget";

import { useSelector } from "store/slices/legacy";
import LAYOUT_CONST from "constant";
import { HORIZONTAL_MAX_ITEM } from "config";

// types
import { NavItemType } from "types";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const theme = useTheme();
  const { layout } = useConfig();
  const { drawerOpen } = useSelector((state) => state.menu);
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    handlerMenuItem();
    // eslint-disable-next-line
  }, []);

  let getMenu = Menu();
  const handlerMenuItem = () => {
    const isFound = menuItem.items.some((element) => {
      if (element.id === "widget") {
        return true;
      }
      return false;
    });

    if (getMenu?.id !== undefined && !isFound) {
      menuItem.items.splice(1, 0, getMenu);
    }
  };

  // last menu-item to show in horizontal menu bar
  const lastItem =
    layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && !matchDownMd
      ? HORIZONTAL_MAX_ITEM
      : null;

  let lastItemIndex = menuItem.items.length - 1;
  let remItems: NavItemType[] = [];
  let lastItemId: string;

  if (lastItem && lastItem < menuItem.items.length) {
    lastItemId = menuItem.items[lastItem - 1].id!;
    lastItemIndex = lastItem - 1;
    remItems = menuItem.items
      .slice(lastItem - 1, menuItem.items.length)
      .map((item) => ({
        title: item.title,
        elements: item.children,
        icon: item.icon,
        ...(item.url && {
          url: item.url,
        }),
      }));
  }

  const navItems = menuItem.items.slice(0, lastItemIndex + 1).map((item) => {
    switch (item.type) {
      case "group":
        if (item.url && item.id !== lastItemId) {
          return (
            <List key={item.id}>
              <NavItem item={item} level={1} isParents />
              {layout !== LAYOUT_CONST.HORIZONTAL_LAYOUT && (
                <Divider sx={{ py: 0.5 }} />
              )}
            </List>
          );
        }

        return (
          <NavGroup
            key={item.id}
            item={item}
            lastItem={lastItem!}
            remItems={remItems}
            lastItemId={lastItemId}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return layout === LAYOUT_CONST.VERTICAL_LAYOUT ||
    (layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && matchDownMd) ? (
    <Box {...(drawerOpen && { sx: { mt: 2 } })}>
      {navItems}
    </Box>
  ) : (
    <>{navItems}</>
  );
};

export default memo(MenuList);
