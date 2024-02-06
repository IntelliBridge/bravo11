import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import { CognitoUser, CognitoUserPool, CognitoUserSession, CognitoUserAttribute, AuthenticationDetails } from 'amazon-cognito-identity-js';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/slices/legacy/actions';
import accountReducer from 'store/slices/legacy/accountReducer';

// project imports
import Loader from 'components/ui/Loader';

// types
import { AWSCognitoContextType, InitialLoginContextProps } from 'types/auth';

// constant
const initialState: InitialLoginContextProps = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

export const userPool = new CognitoUserPool({
    UserPoolId: process.env.REACT_APP_AWS_POOL_ID || '',
    ClientId: process.env.REACT_APP_AWS_APP_CLIENT_ID || ''
});

const setSession = (serviceToken?: string | null) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
    } else {
        localStorage.removeItem('serviceToken');
    }
};

// ==============================|| AWS Cognito CONTEXT & PROVIDER ||============================== //
const AWSCognitoContext = createContext<AWSCognitoContextType | null>(null);

export const AWSCognitoProvider = ({ children }: { children: React.ReactElement }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);

    useEffect(() => {
        const init = async () => {
            try {
                const serviceToken = window.localStorage.getItem('serviceToken');
                if (serviceToken) {
                    setSession(serviceToken);
                    dispatch({
                        type: LOGIN,
                        payload: {
                            isLoggedIn: true,
                            user: {
                                name: 'Betty'
                            }
                        }
                    });
                } else {
                    dispatch({
                        type: LOGOUT
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: LOGOUT
                });
            }
        };

        init();
    }, []);

    const login = async (email: string, password: string) => {
        const usr = new CognitoUser({
            Username: email,
            Pool: userPool
        });

        const authData = new AuthenticationDetails({
            Username: email,
            Password: password
        });

        usr.authenticateUser(authData, {
            onSuccess: (session: CognitoUserSession) => {
                setSession(session.getAccessToken().getJwtToken());

                dispatch({
                    type: LOGIN,
                    payload: {
                        isLoggedIn: true,
                        user: {
                            email: authData.getUsername(),
                            name: 'John Doe'
                        }
                    }
                });
            },
            onFailure: (_err) => {},
            newPasswordRequired: (userAttributes, requiredAttributes) => {
                // // User was signed up by an admin and must provide new
                // // password and required attributes, if any, to complete
                // // authentication.
                // // the api doesn't accept this field back
                // delete userAttributes.email_verified;
                // // unsure about this field, but I don't send this back
                // delete userAttributes.phone_number_verified;
                // // Get these details and call
                // usr.completeNewPasswordChallenge(password, userAttributes, requiredAttributes);
            }
        });
    };

    const register = (email: string, password: string, firstName: string, lastName: string) =>
        new Promise((success, rej) => {
            userPool.signUp(
                email,
                password,
                [
                    new CognitoUserAttribute({ Name: 'email', Value: email }),
                    new CognitoUserAttribute({ Name: 'name', Value: `${firstName} ${lastName}` })
                ],
                [],
                async (err, result) => {
                    if (err) {
                        rej(err);
                        return;
                    }
                    success(result);
                }
            );
        });

    const logout = () => {
        const loggedInUser = userPool.getCurrentUser();
        if (loggedInUser) {
            setSession(null);
            loggedInUser.signOut();
            dispatch({ type: LOGOUT });
        }
    };

    const forgotPassword = async (email: string) => {
        const user = new CognitoUser({
            Username: email,
            Pool: userPool
        });
        user.forgotPassword({
            onSuccess: function () {},
            onFailure: function () {}
        });
    };

    const resetPassword = async (verificationCode: string, newPassword: string) => {
        const email = localStorage.getItem('email');
        if (email) {
            const user = new CognitoUser({
                Username: email as string,
                Pool: userPool
            });
            return new Promise((resolve, reject) => {
                user.confirmPassword(verificationCode, newPassword, {
                    onSuccess: function (data) {
                        localStorage.removeItem('email');
                        resolve(data);
                    },
                    onFailure: function (error) {
                        reject(error.message);
                    }
                });
            });
        } else {
            return new Promise((resolve, reject) => {
                reject('Token expired try again');
            });
        }
    };

    const updateProfile = () => {};

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return (
        <AWSCognitoContext.Provider value={{ ...state, login, logout, forgotPassword, resetPassword, updateProfile, register }}>
            {children}
        </AWSCognitoContext.Provider>
    );
};

export default AWSCognitoContext;
