import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Alert, Button, Grow} from "@mui/material";
import Typography from "@mui/material/Typography";
import AddIcon from '@mui/icons-material/Add';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ClearIcon from '@mui/icons-material/Clear';
import InputMask from 'react-input-mask';


function Register() {
    const {state} = useLocation();
    const {authenticated, auth} = state;
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [emailInputMask, setEmailInputMask] = useState('');
    const [phoneInputMask, setPhoneInputMask] = useState('');
    const [zip, setZip] = useState('');
    const [street, setStreet] = useState('');
    const [district, setDistrict] = useState('');
    const [city, setCity] = useState('');
    const [estate, setEstate] = useState('');
    const [complement, setComplement] = useState('');
    const [error, setError] = useState(false);
    const [zipInvalido, setZipInvalido] = useState(false)
    const [emails, setEmails] = useState([]);
    const [phones, setPhones] = useState([]);
    const [errorMessage, setErrorMessage] = useState('Erro no cadastro!')

    const navigate = useNavigate();

    function checkZip() {
        fetch("https://viacep.com.br/ws/" + zip + "/json/", {
            method: 'GET',
        }).then(res => res.json())
            .then(res => {
                    if (res.erro === true)
                        setZipInvalido(true)
                    else
                        setZipInvalido(false)
                },
                err => {
                    console.log(err)
                })
    }

    function validate(){
        if(zip.length<8) {
            setError(true)
            return
        }
        checkZip()
        if(zipInvalido){
            setError(true)
            setErrorMessage('Cep invalido!')
        }
        if(name.length<3 || name.length>100){
            setError(true)
            setErrorMessage('Nome invalido!')
        }
        if(cpf.length < 11){
            setError(true)
            setErrorMessage('CPF invalido!')
        }
        if(street.length<1){
            setError(true)
            setErrorMessage('Logradouro invalido!')
        }
        if(city.length<1){
            setError(true)
            setErrorMessage('Cidade invalida!')
        }
        if(estate.length<1){
            setError(true)
            setErrorMessage('Estado invalido!')
        }
    }


    if (authenticated === 'admin')
        return <div>
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
                            <InputMask
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text" placeholder="Ana Montalvão"
                                value={name} onChange={(event) => setName(event.target.value)}/>
                        </div>
                        <div className="mb-4 mx-4 flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                CPF
                            </label>
                            <InputMask
                                mask="999.999.999-99"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text" placeholder="256.068.096-46"
                                value={cpf} onChange={(event) => setCpf(event.target.value)}/>
                        </div>
                    </div>
                    <div className={"flex flex-row items-center"}>
                        <div className="mb-4 flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                E-mail
                            </label>
                            <div className={"flex flex-row"}>
                                <InputMask
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text" placeholder="Email@gmail.com" value={emailInputMask}
                                    onChange={(event) => setEmailInputMask(event.target.value)}/>
                                <Tooltip title="Adicionar Email">
                                    <IconButton onClick={() => {
                                        setEmails([...emails, emailInputMask])
                                        setEmailInputMask('')
                                    }}>
                                        <AddIcon/>
                                    </IconButton>
                                </Tooltip>
                            </div>

                        </div>
                        <div className="mb-4 mx-4 flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Telefone
                            </label>
                            <div className={"flex flex-row"}>
                                <InputMask
                                    mask="(99) 9999-9999"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text" placeholder="(61) 98080-2020" value={phoneInputMask}
                                    onChange={(event) => setPhoneInputMask(event.target.value)}/>
                                <Tooltip title="Adicionar Telefone">
                                    <IconButton onClick={() => {
                                        setPhones([...phones, phoneInputMask])
                                        setPhoneInputMask('')
                                    }}>
                                        <AddIcon/>
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    {emails.length !== 0 || phones.length !== 0 ?
                        <div className={"flex flex-row items-center"}>
                            <div className="mb-4 flex-1">
                                {emails.map(e => <div className={"flex flex-row items-center"}>
                                    <Typography>{e}</Typography>
                                    <Tooltip title="Deletar Email" onClick={() => {
                                        setEmails(emails.filter(email => email !== e))
                                    }}>
                                        <IconButton>
                                            <ClearIcon/>
                                        </IconButton>
                                    </Tooltip></div>)}
                            </div>
                            <div className="mb-4 mx-4 flex-1">
                                {phones.map(p => <div className={"flex flex-row items-center"}>
                                    <Typography>{p}</Typography>
                                    <Tooltip title="Deletar Telefone" onClick={() => {
                                        setPhones(phones.filter(phone => phone !== p))
                                    }}>
                                        <IconButton>
                                            <ClearIcon/>
                                        </IconButton>
                                    </Tooltip></div>)}
                            </div>
                        </div> : ''}
                    <div className={"flex flex-row items-center"}>
                        <div className="mb-4 w-72">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Cep
                            </label>
                            <InputMask
                                mask={"99999-999"}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text" placeholder="99999-999"
                                onChange={(event) => setZip(event.target.value)} value={zip}/>
                        </div>
                        <div className="mb-4 mx-4 flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                logradouro
                            </label>
                            <InputMask
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text" placeholder="José de Souza"
                                onChange={(event) => setDistrict(event.target.value)} value={district}/>
                        </div>
                    </div>
                    <div className={"flex flex-row items-center"}>
                        <div className="mb-4 flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Bairro
                            </label>
                            <InputMask
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text" placeholder="Souza"
                                onChange={(event) => setStreet(event.target.value)} value={street}/>
                        </div>
                        <div className="mb-4 mx-4 w-96">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Cidade
                            </label>
                            <InputMask
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text" placeholder="Teófilo Otoni"
                                onChange={(event) => setCity(event.target.value)} value={city}/>
                        </div>
                    </div>
                    <div className={"flex flex-row items-center"}>
                        <div className="mb-4 w-20">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                UF
                            </label>
                            <InputMask
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text" placeholder="MG"
                                onChange={(event) => setEstate(event.target.value)} value={estate}/>
                        </div>
                        <div className="mb-4 mx-4 flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Complemento
                            </label>
                            <InputMask
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text" placeholder="Em frente a banca do zé"
                                onChange={(event) => setComplement(event.target.value)} value={complement}/>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button" >
                            Cadastrar
                        </button>
                    </div>
                </form>
            </div>
            <Grow in={error}>
                <Alert className={"absolute bottom-0 right-0 w-1/3 m-2"} severity="error">{errorMessage}</Alert>
            </Grow>
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
                    if (authenticated === 'user') navigate('/dashboard', {authenticated: 'user'}); else navigate('/')
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
