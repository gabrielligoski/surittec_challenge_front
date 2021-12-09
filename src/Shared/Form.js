import InputMask from "react-input-mask";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import {Alert, Button, DialogTitle, Grow} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import Typography from "@mui/material/Typography";
import ClearIcon from "@mui/icons-material/Clear";
import * as React from "react";
import {useEffect, useState} from "react";


export default function Form(props) {
    const auth = props.auth;
    const type = props.type;
    const putId = props.putId;
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
    const [messageOpen, setMessageOpen] = useState(false);
    const [zipInvalido, setZipInvalido] = useState(false)
    const [emails, setEmails] = useState([]);
    const [phones, setPhones] = useState([]);
    const [message, setMessage] = useState('Erro no cadastro!');
    const [messageType, setMessageType] = useState('error');
    const [valid, setValid] = useState(false);
    const [phoneSelect, setPhoneSelect] = useState(false);

    function checkZip() {
        if (zip.length < 8) {
            setZipInvalido(true)
            return
        }
        fetch("https://viacep.com.br/ws/" + zip + "/json/", {
            method: 'GET',
        }).then(res => res.json())
            .then(res => {
                    if (res.erro === true)
                        setZipInvalido(true)
                    else
                        setZipInvalido(false)
                },
                () => {
                    setZipInvalido(true)
                })
    }

    function validate() {
        checkZip()
        setMessageType('error')
        setMessageOpen(true)
        if (zipInvalido) {
            setMessage('Cep invalido!');
            return;
        }
        if (name.length < 3 || name.length > 100) {
            setMessage('Nome invalido!');
            return;
        }
        if (cpf.length < 11) {
            setMessage('CPF invalido!');
            return;
        }
        if (street.length < 1) {
            setMessage('Bairro invalido!');
            return;
        }
        if (district.length < 1) {
            setMessage('Logradouro invalido!');
            return;
        }
        if (city.length < 1) {
            setMessage('Cidade invalida!');
            return;
        }
        if (estate.length < 1 || estate.length > 2) {
            setMessage('Estado invalido!');
            return;
        }
        if (phones.length < 1) {
            setMessage('É necessário cadastrar ao menos um telefone!');
            return;
        }
        if (emails.length < 1) {
            setMessage('É necessário cadastrar ao menos um email!');
            return;
        }
        setValid(true)
        setMessageOpen(false)
    }

    useEffect(() => {
        if (valid === true) {
            fetch("http://localhost:8080/api/person/", {
                method: type,
                headers: new Headers({
                    'Authorization': 'Basic ' + auth,
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    "name": name,
                    "cpf": Number(cpf.replace(/[- .]/g, '')),
                    "address": {
                        "zip": Number(zip.replace(/[-.]/g, '')),
                        "street": street,
                        "district": district,
                        "city": city,
                        "state": estate.toUpperCase()
                    },
                    "phone": phones.map(p => {
                        return {
                            "phone": Number(p.phone.replace(/[- )(]/g, '')),
                            "type": p.type
                        }
                    }),
                    "email": emails
                })
            })
                .then(res => res.json())
                .then(
                    () => {
                        setName('')
                        setCpf('')
                        setZip('')
                        setEmails([])
                        setPhones([])
                        setDistrict('')
                        setStreet('')
                        setCity('')
                        setEstate('')
                        setComplement('')
                    }
                )
            setMessageOpen(true)
            setMessageType('success')
            setMessage('Cadastro concluído!')
            setValid(false)
        }
    }, [valid])

    useEffect(() => {
        if (type === 'PUT') {
            fetch("http://localhost:8080/api/person/" + putId, {
                method: 'GET',
                headers: new Headers({
                    'Authorization': 'Basic ' + auth
                })
            })
                .then(res => res.json())
                .then(
                    res => {
                        console.log(res)
                        setName(res.name)
                        setCpf(res.cpf)
                        setZip(res.address.zip)
                        setEmails(res.email)
                        setPhones(res.phone.map(phone => {
                            return {
                                "phone": '(' + phone.phone.toString().substring(0, 2) + ') ' + (phone.phone.length === 11 ?
                                    ('9 ' + phone.phone.toString().substring(3, 7) + '-' + phone.phone.toString().substring(7, 11)) :
                                    ('' + phone.phone.toString().substring(2, 6) + '-' + phone.phone.toString().substring(6, 10))),
                                "type": phone.type
                            }
                        }))
                        setDistrict(res.address.district)
                        setStreet(res.address.street)
                        setCity(res.address.city)
                        setEstate(res.address.state)
                        setComplement(res.address.complement)
                    }
                )
            setMessageOpen(true)
            setMessageType('success')
            setMessage('Cadastro concluído!')
            setValid(false)
        }
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setMessageOpen(false)
        }, 3000);
    }, [messageOpen])

    return (
        <div>
            <div className={"w-1/2 absolute transform translate-x-1/2 pt-24"}>
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
                                    type="email" placeholder="Email@gmail.com" value={emailInputMask}
                                    onChange={(event) => setEmailInputMask(event.target.value)}/>
                                <Tooltip title="Adicionar Email">
                                    <IconButton onClick={() => {
                                        if (emailInputMask.length > 5) {
                                            setEmails([...emails, emailInputMask])
                                            setEmailInputMask('')
                                        }
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
                                        setPhoneSelect(true)
                                    }}>
                                        <AddIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Dialog onClose={() => setPhoneSelect(false)} open={phoneSelect} className={""}>
                                    <DialogTitle>Qual tipo de telefone?</DialogTitle>
                                    <div className={"flex flex-row"}>
                                        <div className={"p-4"}>
                                            <Button variant={"outlined"} className={"flex-1"} onClick={() => {
                                                if (phoneInputMask.length > 10) {
                                                    setPhones([...phones, {
                                                        "phone": phoneInputMask,
                                                        "type": 'LANDLINE'
                                                    }])
                                                    setPhoneInputMask('')
                                                }
                                                setPhoneSelect(false)
                                            }
                                            }><Tooltip
                                                title="Residencial"><HomeIcon/></Tooltip></Button>
                                        </div>
                                        <div className={"p-4"}>
                                            <Button variant={"outlined"} className={"flex-1"} onClick={() => {
                                                if (phoneInputMask.length > 10) {
                                                    setPhones([...phones, {
                                                        "phone": phoneInputMask,
                                                        "type": 'WORK'
                                                    }])
                                                    setPhoneInputMask('')
                                                }
                                                setPhoneSelect(false)
                                            }
                                            }><Tooltip
                                                title="Comercial"><WorkIcon/></Tooltip></Button>
                                        </div>
                                        <div className={"p-4"}>
                                            <Button variant={"outlined"} className={"flex-1"}><Tooltip
                                                title="Celular" onClick={() => {
                                                if (phoneInputMask.length > 10) {
                                                    setPhones([...phones, {
                                                        "phone": phoneInputMask.substring(0, 4) + ' 9 ' + phoneInputMask.substring(5, 14),
                                                        "type": 'PERSONAL'
                                                    }])
                                                    setPhoneInputMask('')
                                                }
                                                setPhoneSelect(false)
                                            }
                                            }><PhoneAndroidIcon/></Tooltip></Button>
                                        </div>
                                    </div>
                                </Dialog>
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
                                    <Typography className={"pr-2"}>{p.phone}</Typography>
                                    {p.type === 'PERSONAL' ? <PhoneAndroidIcon/> : p.type === 'WORK' ? <WorkIcon/> :
                                        <HomeIcon/>}
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
                                mask={"aa"}
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
                            type="button" onClick={() => validate()}>
                            {type === 'PUT' ? 'Atualizar' : 'Cadastrar'}
                        </button>
                    </div>
                </form>
            </div>
            <Grow in={messageOpen} easing={{exit: '1000'}}>
                <Alert className={"absolute bottom-0 right-0 w-1/3 m-2"} severity={messageType}>{message}</Alert>
            </Grow>
        </div>
    )
}
