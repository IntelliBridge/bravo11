# Introduction

This is material design template created based on materially structure
This template is based on https://mui.com/store/previews/berry-react-material-admin/

## Libraries used
- UI kit - MaterialUI
- Store - Zustand
- Styles - JSX



## Getting Started

1. Installation process
    - run 'npm install --legacy-peer-deps / yarn'
    - start dev server run 'npm run start / yarn start'
2. Deployment process
    - Goto full-version directory and open package.json. Update homepage URL to the production URL
    - Goto full-version directory and run 'npm run build / yarn build'


## Code patterns
### Creating api actions
Api fetches are created within `src/api/`. Here is an example entity action called `user.ts`
```
import client from './client';

const getUsers = () => client.get('/users');

const users = {
    getUsers,
};

export default users;
```
Api fetches can then be used in a compoent as such:

```
import userApi from '../../api/user'

const MyComponent = () => {
    const users = useApi(userApi.getUsers)

    return (
        <>
          {users.loading ? <Loader /> : (
            users.data.map(d => <SomeComponent user={d} />)
          )}
        </>
    )
}
```

### Using Zustand
Create a slice such as below:
```
import { createSelectors } from './legacy/helpers'
import { create } from 'zustand'

const initialProjectState = {
  users: []
}

const createUserSlice = (set: any, ..._: any) => {
  const resetters: (() => any)[] = []
  resetters.push(() => set(initialProjectState))
  return {
    ...initialProjectState,
    addUser: (user: any) => {
      set((state: any) => ({
        ...state,
        projects: [user, ...state.users],
      }))
    },
    setUsers: (projects: object) => {
      set((state: object) => ({
        ...state,
        projects,
      }))
    }
  }
}

export const useProjectStore = createSelectors(
  create()((...a) => ({
    ...createUserSlice(...a),
  }))
)

```

Utilize the slice as flow
```
import { useUserStore } from '../stores/slices/users'


const MyComponent = () => {
    const users = useUserStore.use.users()
    const setUsers = useuserStore.use.users()

    const handleSomeEvent = (user) => {
        setUsers(user)
    }

    return (
        {users.map(u => <UserComp data={u} />)}
    )
}
```
