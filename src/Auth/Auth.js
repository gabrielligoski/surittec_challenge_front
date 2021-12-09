import React, {useState} from "react";
import {useNavigate} from "react-router-dom";


function Auth() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const base64 = require('base-64');
    const navigate = useNavigate();

    function authenticate() {
        const auth = window.btoa(username + ":" + password)
        console.log(auth)

        fetch("http://localhost:8080/auth", {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Basic ' + auth
            })
        }).then(res => res.json())
            .then(res => {
                console.log(res)
                    if (res.role === 'admin')
                        navigate('/dashboard', {
                            state:
                                {
                                    authenticated: 'admin',
                                    auth: auth
                                }
                        })
                    else if (res.role === 'comum')
                        navigate('/dashboard', {
                            state:
                                {
                                    authenticated: 'user',
                                    auth: auth
                                }
                        })
                    else
                        setError(true)
                },
                err => {
                    console.log(err)
                })
    }

    return (
        <div className="absolute w-1/2 h-1/2 transform translate-x-1/2 translate-y-1/2">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Usuário
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text" placeholder="Usuário" value={username}
                        onChange={(event) => setUsername(event.target.value)}/>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Senha
                    </label>
                    <input
                        className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        type="password" placeholder="******************" value={password}
                        onChange={(event) => setPassword(event.target.value)}/>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button" onClick={() => authenticate()}>
                        Entrar
                    </button>
                </div>
            </form>
            <p className="text-center text-gray-500 text-xs">
                &copy;2020 Example Corp. All rights reserved.
            </p>
        </div>
    );
}

export default Auth;
