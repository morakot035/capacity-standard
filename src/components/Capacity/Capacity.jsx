import React, { useState, useEffect } from "react";

import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ListSubheader from '@mui/material/ListSubheader';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Button, Backdrop, CircularProgress, Checkbox } from "@mui/material";
import Table from "../Table/Table";
import { db } from "../../firebase/firebase"
import { collection, addDoc, getDocs,deleteDoc, doc,onSnapshot, updateDoc } from "firebase/firestore";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const stdColumns = [
  { id: '1', label: 'Line' },
  { id: '2', label: 'Line Type' },
  { id: '3', label: 'Brand' },
  { id: '4', label: 'Brand (M/C)' },
  { id: '5', label: 'Year' },
  { id: '6', label: 'SKUs' },
  { id: '7', label: 'Size' },
  { id: '8', label: 'Speed (bpt)' },
  { id: '9', label: `% Eff (STD)` },
  { id: '10', label: `Production Hr.(STD)` },
  { id: '11', label: `WORKING DAYS (Days/Year) PER YEAR` },
  { id: '12', label: `Forecast ML./Year` },
  { id: '13', label: `Cap (L/Day)` },
  { id: '14', label: `Cap (ML/Day)` },
  { id: '15', label: `Forecast/Capต่อวัน` },
  { id: '16', label: `Sumวันทำงานจริง` },
  { id: '17', label: 'วันที่เหลือจาก 290 วัน' },
  { id: '18', label: '%Uti Rev.' },
  { id: '19', label: 'สัดส่วนวันทำงานที่ใช้จริง' },
  { id: '20', label: 'วันทำงานที่เหลือ' },
  { id: '21', label: `Working Days per year (Calc)` },
  { id: '22', label: `Capacity year(Calc)` },
  { id: '23', label: `%UTILIZATION(Calc)` },
  { id: '24', label: `Working Days per year (budget)` },
  { id: '25', label: `%UTILIZATION(budget)` },
  { id: '26', label: `Capacity year(budget)` }
];

const columns = [
  { id: '1', label: 'Line' },
  { id: '2', label: 'Line Type' },
  { id: '3', label: 'Brand' },
  { id: '4', label: 'Brand<br/>(M/C)' },
  { id: '5', label: 'Year' },
  { id: '6', label: 'SKUs' },
  { id: '7', label: 'Size' },
  { id: '8', label: 'Speed<br/>(bpt)' },
  { id: '9', label: `% Eff<br/>(STD)` },
  { id: '10', label: `Production<br/>Hr.(STD)` },
  { id: '11', label: `WORKING DAYS<br/>(Days/Year)` },
  { id: '12', label: `Forecast ML.<br/>Year` },
  { id: '13', label: `Cap (L/Day)` },
  { id: '14', label: `Cap (ML/Day)` },
  { id: '15', label: `Forecast/Cap<br/>ต่อวัน` },
  { id: '16', label: `Sumวันทำงานจริง` },
  { id: '17', label: 'วันที่เหลือจาก<br/>290 วัน' },
  { id: '18', label: '%Uti Rev.' },
  { id: '19', label: 'สัดส่วนวันทำงาน<br/>ที่ใช้จริง' },
  { id: '20', label: 'วันทำงานที่เหลือ' },
  { id: '21', label: `Working Days<br/>per year (Calc)` },
  { id: '22', label: `Capacity year<br/>(Calc)` },
  { id: '23', label: `%UTILIZATION<br/>(Calc)` },
  { id: '24', label: `Working Days<br/>per year (budget)` },
  { id: '25', label: `%UTILIZATION<br/>(budget)` },
  { id: '26', label: `Capacity year<br/>(budget)` }
];

export default function Capacity() {
  const theme = useTheme();
  const [dataProducts, setDataProducts] = useState([])
  const [product, setProduct] = useState("")
  const [dataPlant, setDataPlant] = useState([])
  const [plant, setPlant] = useState("")
  const [selectedLine, setSelectedLine] = useState("");
  const groupProduct = collection(db, "products")
  const plants = collection(db, "plant")
  const defaultColumns = ['1', '2','3','4','6','7','8','9','10','11','12','21','22','23','24','25','26'];
  const [selectedColumns, setSelectedColumns] = useState(defaultColumns);
  const [selectedLines, setSelectedLines] = useState([]);

  const handleChange = (event) => {
    setSelectedColumns(event.target.value);
  };

  const renderSelectedColumns = (selected) => {
    if (!Array.isArray(selected)) {
      return '';
    }
    return selected.map(id => stdColumns.find(col => col.id === id)?.label).join(', ');
  };

  useEffect(() => {
    const unsubscribeProducts = onSnapshot(groupProduct, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDataProducts(newData);
    });
  
    const unsubscribePlants = onSnapshot(plants, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDataPlant(newData);
    });
  
    return () => {
      unsubscribeProducts(); 
      unsubscribePlants();   
    };
  }, []);

  const handleProduct = (e) => {
    setProduct(e.target.value)
  }

  const handlePlant = (e) => {
    setPlant(e.target.value);
  };

  const handleLineChange = (event, newValue) => {
    setSelectedLines(newValue);
    console.log("yok ", newValue)
    // setSelectedLine(newValue ? newValue : { firstLetter: '', title: '' });
  };

  // แปลงข้อมูลเป็นรูปแบบที่ต้องการ
  const options = dataPlant.flatMap(plant => 
    plant.lines.map(line => ({
      firstLetter: plant.plantName,  // ชื่อของ plant
      title: line                // ชื่อของ line
    }))
  );

  // ตรวจสอบว่า options มีค่าถูกต้องก่อนใช้ sort
  const sortedOptions = options.sort((a, b) => {
    if (!a.firstLetter || !b.firstLetter) return 0;
    return -a.firstLetter.localeCompare(b.firstLetter);
  });

  const toggleSelection = (option) => {
    // เช็คว่า option อยู่ใน selectedLines หรือไม่
    const isSelected = selectedLines.some((line) => line.title === option.title && line.firstLetter === option.firstLetter);
  
    if (isSelected) {
      // ถ้ามีให้ลบออก
      setSelectedLines(selectedLines.filter((line) => line.title !== option.title && line.firstLetter !== option.firstLetter));
    } else {
      // ถ้าไม่มีให้เพิ่มเข้าไป
      setSelectedLines([...selectedLines, option]);
    }
  };

  return (
    <div className="bg-slate-700 py-10 min-h-screen grid"
    style={{
    gridTemplateColumns: "1fr 1fr 1fr 1fr",  // layout สำหรับ desktop
    gap: "10px",
    padding: "10px",
    '@media (max-width: 768px)': {  // ปรับ layout สำหรับ mobile
      gridTemplateColumns: "1fr",  // ให้แต่ละ column stack กัน
    }
  }}
    >
     
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">Plant</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          onChange={(e) => handlePlant(e)}
          value={plant}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {dataPlant.map((row) => (
            <MenuItem
              key={row.plantName}
              value={row.plantName}
              
            >
              {row.plantName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <Autocomplete
          id="grouped-demo"
          multiple
          options={sortedOptions}
          value={selectedLines}
          disableCloseOnSelect
          groupBy={(option) => option.firstLetter}  // ใช้ firstLetter เพื่อจัดกลุ่ม
          getOptionLabel={(option) => option.title}  // แสดงชื่อ line
          onChange={handleLineChange}  // ใช้ handleChange เพื่อจัดการการเปลี่ยนแปลง
          MenuProps={MenuProps}
          renderInput={(params) => <TextField {...params} label="Line" />}
          renderGroup={(params) => (
            <React.Fragment>
              <ListSubheader style={{ color: "#2b77ff", fontWeight: "bold" }}>
                Plant: {params.group}
              </ListSubheader>
              {params.children}
            </React.Fragment>
          )}
          renderOption={(props, option, state) => (
            <MenuItem {...props} onClick={() => toggleSelection(option)}>
              <Checkbox checked={selectedLines.some((line) => line.title === option.title && line.firstLetter === option.firstLetter)} />
              {option.title}
            </MenuItem>
          )}
        />
      </FormControl>



      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">Product</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name-label"
          onChange={(e) => handleProduct(e)}
          value={product}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
           <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {dataProducts.map((row) => (
            <MenuItem
              key={row.productName}
              value={row.productName || []}
            >
              {row.productName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">Filter</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name-label"
          multiple
          onChange={handleChange}
          value={selectedColumns}
          renderValue={renderSelectedColumns}
          input={<OutlinedInput label="Filter" />}
          MenuProps={MenuProps}
        >
            {stdColumns.map((column) => (
            <MenuItem key={column.id} value={column.id}>
              <input
                type="checkbox"
                checked={selectedColumns.includes(column.id)}
                readOnly
              />
              {column.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Table 
      selectedGroupProduct={product} 
      selectedPlant={plant} 
      columns={columns} 
      selectedColumns={selectedColumns}
      selectedLines={selectedLines}
       />
       
    </div>
  );
}