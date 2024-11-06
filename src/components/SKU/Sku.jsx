import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import DoneAll from '@mui/icons-material/DoneAll';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import { db } from "../../firebase/firebase"
import { collection, addDoc, getDocs,deleteDoc, doc,onSnapshot, updateDoc } from "firebase/firestore";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Sku = () => {
  const [form, setForm] = useState({})
  const [data, setData] = useState([])
  const [editId, setEditId] = useState(null);
  const sku = collection(db, "sku")
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const unsubscribe = loadRealtime();
    return () => {
      unsubscribe();
    };
  },[])

  const loadRealtime =  () => {
    const unsubscribe = onSnapshot(sku, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(newData);
    });
    return () => {
      unsubscribe();
    };
  }

  const handleAddData = async () => {
    if (editId) {
      const docRef = doc(db, "sku", editId);
      await updateDoc(docRef, form)
        .then(() => {
          setEditId(null);
          setForm({});
        })
        .catch((err) => console.log(err));
    } else {
      await addDoc(sku, form)
        .then((res) => {
          setForm({});
        })
        .catch((err) => console.log(err));
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(sku, id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item.id);
  };
  return (
    <>
      <Box sx={{ display: 'flex' }}>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <h1>SKU</h1>
          
                <Box
                  component="form"
                  sx={{
                    '& > :not(style)': { m: 2, width: '30ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField 
                  onChange={(e) => handleChange(e)}
                  value={form.skuName || ''}
                  name="skuName" 
                  id="outlined-basic" 
                  label="SKU" 
                  variant="outlined" />

                  <TextField 
                  onChange={(e) => handleChange(e)}
                  value={form.size || ''}
                  name="size" 
                  id="outlined-basic" 
                  label="Size (L/Bottle)" 
                  variant="outlined" />
                </Box>
                
            
            <FormControl sx={{ m: 2, width: 400 }}>
                <Stack direction="row" spacing={10}>
              
                  <Button size="large" variant="contained" onClick={handleAddData} endIcon={<DoneAll />}>
                    Submit
                  </Button>
              </Stack>
            </FormControl>
            <FormControl sx={{ m: 1, width: "100%" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell width={"50%"}><b>SKUs</b></StyledTableCell>
                    <StyledTableCell width={"50%"}><b>Size (L/Bottle)</b></StyledTableCell>
                    <StyledTableCell align="center">Edit</StyledTableCell>
                    <StyledTableCell align="center">Delete</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={row.id}
                      tabIndex={-1}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.skuName}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.size}
                      </TableCell>
                      <TableCell align="center">
                        <Button variant="contained" color="primary" onClick={() => handleEdit(row)}>
                        <Edit />
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <Button variant="outlined" color="error"  onClick={() => handleDelete(row.id)}>
                          <Delete />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </FormControl>
        </Box>
      </Box>
     
    </>
  );
};

export default Sku;