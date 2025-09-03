import React, { useState, useEffect } from 'react';
import { TextField, TableCell } from '@mui/material';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase/firebase"
import Tooltip from '@mui/material/Tooltip';

const ForecastCell = ({ documentId, plantIndex, lineIndex, line, detail, rowSpan, detailIndex, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(detail.lineForecast)
  // const [value, setValue] = useState(
  //   line.groupProducts.includes("Beer") ? line.forecast : detail.lineForecast
  // );

  useEffect(() => {
    setValue(detail.lineForecast);
  }, [detail.lineForecast]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBlur = async () => {
    setIsEditing(false);
    await onUpdate(documentId, plantIndex, lineIndex, detailIndex, line, value);
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
        await onUpdate(documentId, plantIndex, lineIndex, detailIndex, line, value);
      setIsEditing(false);
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
    
        <TableCell align="center" style={{ color: "#8A2BE2", fontWeight: "bold"}}>
           {isEditing ? (
                <TextField
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyPress={handleKeyPress}
                autoFocus
                style={{width: "80px"}}
                size="small"
                />
            ) : (
                <span onClick={handleEdit} rowSpan={1} style={{ cursor: 'pointer' }}>
                   <Tooltip title="คลิ๊กเพื่ออัพเดท">{value}</Tooltip>
                </span>
            )}
         </TableCell>
        </>
   
   );
};

export default ForecastCell