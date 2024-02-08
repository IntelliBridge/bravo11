import { useEffect, useState } from "react";

// routing
import Routes from "routes";

// project imports
import Locales from "components/ui/Locales";
import NavigationScroll from "components/common/layout/NavigationScroll";
import Snackbar from "components/ui/extended/Snackbar";
import Loader from "components/ui/Loader";
import Notistack from "components/ui/third-party/Notistack";

import ThemeCustomization from "themes";
import { dispatch } from "store/slices/legacy";
import { getMenu } from "store/slices/legacy/menu";

// auth provider
import { JWTProvider as AuthProvider } from "contexts/JWTContext";
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// styles
import 'maplibre-gl/dist/maplibre-gl.css';

// ==============================|| APP ||============================== //

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getMenu()).then(() => {
      setLoading(true);
    });
  }, []);

  if (!loading) return <Loader />;

  return (
    <ThemeCustomization>
      <Locales>
        <NavigationScroll>
          <AuthProvider>
            <>
              <Notistack>
                <Routes />
                <Snackbar />
              </Notistack>
            </>
          </AuthProvider>
        </NavigationScroll>
      </Locales>
    </ThemeCustomization>
  );
};

export default App;
