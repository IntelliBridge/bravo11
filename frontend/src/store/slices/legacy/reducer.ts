// third-party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project imports
import snackbarReducer from './snackbar';
import customerReducer from './customer';
import contactReducer from './contact';
import productReducer from './product';
import chatReducer from './chat';
import calendarReducer from './calendar';
import mailReducer from './mail';
import userReducer from './user';
import cartReducer from './cart';
import kanbanReducer from './kanban';
import menuReducer from './menu';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    snackbar: snackbarReducer,
    cart: persistReducer(
        {
            key: 'cart',
            storage,
            keyPrefix: 'berry-'
        },
        cartReducer
    ),
    kanban: kanbanReducer,
    customer: customerReducer,
    contact: contactReducer,
    product: productReducer,
    chat: chatReducer,
    calendar: calendarReducer,
    mail: mailReducer,
    user: userReducer,
    menu: menuReducer
});

export default reducer;
