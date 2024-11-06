import React, { useState, useEffect } from 'react';
import { TextField, TableCell } from '@mui/material';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"
import Tooltip from '@mui/material/Tooltip';

const EffCell = ({ documentId, plantIndex, lineIndex, line, detail, detailIndex, onUpdateEff }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(detail.eff);
  const handleEdit = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    setValue(detail.eff);
  }, [detail.eff]);

  const handleBlur = async () => {
    setIsEditing(false);
    await onUpdateEff(documentId, plantIndex, lineIndex, detailIndex, line, value);
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
        await onUpdateEff(documentId, plantIndex, lineIndex, detailIndex, line, value);
      setIsEditing(false);
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
        <TableCell align="center" style={{ color: "#CC6600", fontWeight: "bold"}}>
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

export default EffCell