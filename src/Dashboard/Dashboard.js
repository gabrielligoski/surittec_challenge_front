import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {Button, Modal} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import Form from "../Shared/Form";


function createData(name, pcpf, paddress, pphone, email, id) {
    let cpf = pcpf.toString().substring(0, 3) + '.' + pcpf.toString().substring(3, 6)
        + '.' + pcpf.toString().substring(6, 9) + '-' + pcpf.toString().substring(9, 11)

    let address = paddress.toString().substring(0, 5) + '-' + paddress.toString().substring(5, 8)

    let phone = '(' + pphone.toString().substring(0, 2) + ') ' + (pphone.length === 11 ?
        ('9 ' + pphone.toString().substring(3, 7) + '-' + pphone.toString().substring(7, 11)) :
        ('' + pphone.toString().substring(2, 6) + '-' + pphone.toString().substring(6, 10)))

    return {
        name,
        cpf,
        address,
        phone,
        email,
        id
    };
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'name',
        label: 'Nome',
    },
    {
        id: 'cpf',
        label: 'CPF',
    },
    {
        id: 'address',
        label: 'Endereço',
    },
    {
        id: 'phone',
        label: 'Telefone',
    },
    {
        id: 'email',
        label: 'Email',
    },
];


export default function Dashboard() {
    const [open, setOpen] = useState(false);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const {state} = useLocation();
    const [deleting, setDeleting] = useState(false);
    const {authenticated, auth} = state !== null ? state : '';
    const [rows, setRows] = useState([]);
    const [putId, setPutId] = useState(0);
    const navigate = useNavigate();


    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    function deleteById(id) {
        fetch("http://localhost:8080/api/person/" + id, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Basic ' + auth
            })
        })
            .then(res => res.json())
            .then(res => console.log(res))
    }

    useEffect(() => {
        fetch("http://localhost:8080/api/person/", {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Basic ' + auth
            })
        })
            .then(res => res.json())
            .then(
                res => {
                    const persons = []
                    res.map(person => {
                        persons.push(createData(person.name, person.cpf, person.address.zip, person.phone[0].phone, person.email[0], person.id))
                    })
                    setSelected([])
                    setRows(persons)
                    setDeleting(false)
                }
            )
    }, [deleting])

    if (authenticated)
        return <div>
            <Box className={"w-full p-6"}>
                <Paper className={"w-full mb-2"}>
                    <Toolbar className={"p-2"}>
                        {selected.length > 0 ? (
                            <Typography className={"flex"} variant="subtitle1">
                                {selected.length} selecionado(s)
                            </Typography>
                        ) : (
                            <Typography className={"flex"} variant="h6">
                                Usuários Cadastrados
                            </Typography>
                        )}
                        {selected.length > 0 ? (
                            <Tooltip title="Deletar">
                                <IconButton onClick={() => {
                                    selected.map(i => deleteById(i))
                                    setDeleting(true)
                                }}>
                                    <DeleteIcon/>
                                </IconButton>
                            </Tooltip>
                        ) : ''}
                    </Toolbar>
                    <TableContainer>
                        <Table size={'medium'}>
                            <TableHead>
                                <TableRow>
                                    {authenticated === 'admin' ? <TableCell className={"invisible"} padding="checkbox">
                                        <Checkbox/>
                                    </TableCell> : ''}
                                    {headCells.map((headCell) => (
                                        <TableCell
                                            key={headCell.id}
                                            sortDirection={orderBy === headCell.id ? order : false}
                                        >
                                            <TableSortLabel
                                                active={orderBy === headCell.id}
                                                direction={orderBy === headCell.id ? order : 'asc'}
                                                onClick={createSortHandler(headCell.id)}
                                            >
                                                {headCell.label}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stableSort(rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                            >
                                                {authenticated === 'admin' ? <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        onClick={(event) => handleClick(event, row.id)}
                                                    /></TableCell> : ''}
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.cpf}</TableCell>
                                                <TableCell>{row.address}</TableCell>
                                                <TableCell>{row.phone}</TableCell>
                                                <TableCell>{row.email}</TableCell>
                                                {authenticated === 'admin' ? <Tooltip title="Editar">
                                                    <IconButton>
                                                        <EditIcon onClick={() => {
                                                            setPutId(row.id)
                                                            setOpen(true)
                                                        }}/>
                                                    </IconButton>
                                                </Tooltip> : ''}
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6}/>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 15, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
                {authenticated === 'admin' ? <Button
                    variant={"outlined"}
                    className={"w-full h-16"}
                    onClick={() => {
                        navigate('/register', {
                            state:
                                {
                                    authenticated: authenticated,
                                    auth: auth
                                }
                        })
                    }}
                    type="button">
                    Cadastrar
                </Button> : ''}
            </Box>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Form auth={auth} type={'PUT'} putId={putId}/>
            </Modal>
        </div>
    else
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
                    navigate('/')
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
