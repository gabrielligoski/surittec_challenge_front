import React from "react";


function Register() {
    return (
        <div>
            <div className={"absolute w-1/2 transform translate-x-1/2 pt-32"}>
                <p className={"text-5xl text-blue-500 text-sm font-bold"} variant="h6">
                    Cadastro de Usuários
                </p>
            </div>
            <div className="absolute w-1/2 h-1/2 transform translate-x-1/2 translate-y-1/2">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className={"flex flex-row items-center"}>
                        <div className="mb-4 w-96">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Nome
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text" placeholder="Ana Montalvão"/>
                        </div>
                        <div className="mb-4 mx-4 flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                E-mail
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text" placeholder="Email@gmail.com"/>
                        </div>
                    </div>
                    <div className={"flex flex-row items-center"}>
                        <div className="mb-4 flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                CPF
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text" placeholder="256.068.096-46"/>
                        </div>
                        <div className="mb-4 mx-4 flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Telefone
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text" placeholder="(61) 98080-2020"/>
                        </div>
                    </div>
                    <div className="mb-4 flex-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Endereço
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text" placeholder="Southfield 2135 Cunningham Court"/>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button">
                            Cadastrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
