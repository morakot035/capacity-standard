import React, { useState, useEffect } from 'react';
import { TextField, TableCell } from '@mui/material';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"
import Tooltip from '@mui/material/Tooltip';

const WorkDayCell = ({ documentId, plantIndex, lineIndex, line, detail, detailIndex, onUpdateWorkDay }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(detail.workDayPerYear);

  const handleEdit = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    setValue(detail.workDayPerYear);
  }, [detail.workDayPerYear]);

  const handleBlur = async () => {
    setIsEditing(false);
    await onUpdateWorkDay(documentId, plantIndex, lineIndex, detailIndex, line, value);
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
        await onUpdateWorkDay(documentId, plantIndex, lineIndex, detailIndex, line, value);
      setIsEditing(false);
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
        <TableCell align="center" style={{background: "#AFEEEE", color: "#000000", fontWeight: "bold"}}>
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
                <span onClick={handleEdit} style={{ cursor: 'pointer' }}>
                    <Tooltip title="คลิ๊กเพื่ออัพเดท">{value}</Tooltip>
                </span>
            )}
         </TableCell>

    </>
   );
};

export default WorkDayCell