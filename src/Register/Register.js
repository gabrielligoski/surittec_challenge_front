import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import Form from "../Shared/Form";

function Register() {
    const navigate = useNavigate();
    const {state} = useLocation();
    const {authenticated, auth} = state !== null ? state : '';


    if (authenticated === 'admin')
        return <div>
            <div className={"p-12"}>
                <Button variant={"outlined"} className={"w-40"} onClick={() => {
                    navigate('/dashboard', {
                        state:
                            {
                                authenticated: authenticated,
                                auth: auth
                            }
                    })
                }}>{"< Go Back!"}</Button>
            </div>
            <div className={"absolute w-1/2 transform translate-x-1/2"}>
                <p className={"text-5xl text-blue-500 text-sm font-bold"} variant="h6">
                    Cadastro de Usuários
                </p>
            </div>
            <Form auth={auth} type={'POST'}/>
        </div>
    else
        // random 404 page from internet
        return <div className="w-screen h-screen flex flex-row space-x-6">
            <div className="flex flex-1 flex-col space-y-4 items-center justify-center">
                <h1 className="font-bold text-blue-600 text-9xl">404</h1>
                <p className="text-2xl font-bold text-center text-gray-800">
                    <span className="text-red-500">Oops!</span> Page not found
                </p>
                <p className="text-center text-gray-500">
                    The page you’re looking for doesn’t exist.
                </p>
                <Button variant={"outlined"} onClick={() => {
                    if (authenticated) navigate('/dashboard', {
                        state:
                            {
                                authenticated: authenticated,
                                auth: auth
                            }
                    }); else navigate('/')
                }}>GO HOME</Button>
            </div>
            <div className="">
                <img
                    src="https://cdn.pixabay.com/photo/2016/11/22/23/13/black-dog-1851106__340.jpg"
                    alt="img"
                    className="object-cover w-full h-full"
                />
            </div>
        </div>
}

export default Register;
