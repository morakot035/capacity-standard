import React, { useState, useEffect } from "react";
import Sidebar from "../../shared/components/Sidebar/Sidebar";
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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { db } from "../../shared/services/firebase/firebase"
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

const Plant = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({})
  const [data, setData] = useState([])
  const [editId, setEditId] = useState(null);
  const plant = collection(db, "plant")
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
    const unsubscribe = onSnapshot(plant, (snapshot) => {
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
      const docRef = doc(db, "plant", editId);
      await updateDoc(docRef, form)
        .then(() => {
          setEditId(null);
          setForm({});
        })
        .catch((err) => console.log(err));
    } else {
      await addDoc(plant, form)
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
      await deleteDoc(doc(plant, id));
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
      <Box style={{fontFamily: 'Kanit, sans-serif'}} sx={{ display: 'flex' }}>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <h1>Plant</h1>
          
                <Box
                  component="form"
                  sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField 
                  onChange={(e) => handleChange(e)}
                  value={form.plantName || ''}
                  name="plantName" 
                  id="outlined-basic" 
                  label="Plant" 
                  variant="outlined" />
                </Box>
            
            <FormControl sx={{ m: 1, width: 400 }}>
                <Stack direction="row" spacing={10}>
              
                  <Button style={{fontFamily: 'Kanit, sans-serif'}} size="large" variant="contained" onClick={handleAddData} endIcon={<DoneAll />}>
                    ตกลง
                  </Button>
              </Stack>
            </FormControl>
            <FormControl sx={{ m: 1, width: "100%" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell />
                    <StyledTableCell style={{fontFamily: 'Kanit, sans-serif'}} width={"100%"}><b>Plant</b></StyledTableCell>
                    <StyledTableCell style={{fontFamily: 'Kanit, sans-serif'}} align="center">Edit</StyledTableCell>
                    <StyledTableCell style={{fontFamily: 'Kanit, sans-serif'}} align="center">Delete</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                
                  {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <React.Fragment>
                    <TableRow
                      key={row.id}
                      tabIndex={-1}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell>
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => setOpen(!open)}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </TableCell>
                      <TableCell component="th" scope="row">
                        <span style={{color: "blue", fontWeight: "bold"}}> {row.plantName} </span>
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
                     <TableRow>
                     <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                         <Box sx={{ margin: 1 }}>
                         <Typography variant="h6" gutterBottom component="div">
                            ไลน์ผลิต
                         </Typography>
                         <Table size="small" aria-label="purchases">
                             <TableHead>
                                 <TableRow>
                                     <TableCell></TableCell>
                                 </TableRow>
                             </TableHead>
                             <TableBody>
                                 {row.lines.map((line) => (
                                     <TableRow key={line}>
                                         <TableCell component="th" scope="row">
                                             {line}
                                         </TableCell>
                                     </TableRow>
                                 ))}
 
                             </TableBody>
                         </Table>
                         </Box>
                         </Collapse>
                     </TableCell>
                   </TableRow>
                   </React.Fragment>
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

export default Plant;