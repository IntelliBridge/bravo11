import client from './client';

const getUsers = () => client.get('/users');

const users = {
    getUsers,
};

export default users;
