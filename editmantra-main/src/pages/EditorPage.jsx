import React, { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';
import { initSocket } from '../socket';


const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();

            const handleErrors = (e) => {
                console.error('Socket error:', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/RealTimeCollaboration');
            };
            socketRef.current.on('connect_error', handleErrors);
            socketRef.current.on('connect_failed', handleErrors);

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room.`);
                }
                setClients(clients);

                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code: codeRef.current,
                    socketId,
                });
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => prev.filter((client) => client.socketId !== socketId));
            });
        };

        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
            }
        };
    }, [roomId, location.state?.username, reactNavigator]);

    const copyRoomId = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }, [roomId]);

    const leaveRoom = useCallback(() => {
        reactNavigator('/RealTimeCollaboration');
    }, [reactNavigator]);

    if (!location.state) {
        return <Navigate to="/RealTimeCollaboration" />;
    }

    return (
        <div className="grid grid-cols-[230px_1fr] h-screen text-white bg-gray-900">
            <div className="bg-[#1c1e29] p-4 flex flex-col">
                <div className="flex-1">
                    <div className="border-b border-gray-600 pb-2 mb-4">
                        <p className='text-center justify-center text-cyan-400 text-2xl font-bold' >EditMantra</p>
                    </div>
                    <h3 className="text-lg font-bold mb-4 justify-center text-center text-green-400">Connected</h3>
                    <div className="flex flex-wrap gap-4">
                        {clients.map((client) => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div>
                </div>
                <button
                    className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-4 rounded mt-4 transition-all duration-300 transform hover:scale-105"
                    onClick={copyRoomId}
                >
                    Copy Room ID
                </button>
                <button
                    className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-2 px-4 rounded mt-4 transition-all duration-300 transform hover:scale-105"
                    onClick={leaveRoom}
                >
                    Leave
                </button>
            </div>
            <div className="bg-[#424761]">
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />
            </div>
        </div>
    );
};

export default EditorPage;
