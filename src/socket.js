import {io} from 'socket.io-client'

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ['websocket', 'polling'],
    };

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    return io(backendUrl, options);
};
