import { Link as RouterLink } from "react-router-dom";

// material-ui
import { Link } from "@mui/material";

// project imports
import { DASHBOARD_PATH } from "config";
import Logo from "components/ui/Logo";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
  <Link component={RouterLink} to={DASHBOARD_PATH} aria-label="theme-logo">
    <div style={{ paddingRight: 20 }}>
      <Logo />
    </div>
  </Link>
);

export default LogoSection;
