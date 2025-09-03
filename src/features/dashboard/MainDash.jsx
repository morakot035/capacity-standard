import React from "react";
import Capacity from "../capacity/Capacity";
import Sidebar from "../../shared/components/Sidebar/Sidebar"
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const MainDash = () => {
  return (
    <div
    style={{
      background: "linear-gradient(to right, #F5F5F5, #FFFAF0)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "100vh", // ทำให้รูปพื้นหลังยาวเต็มหน้าจอ
  }}
    >
      <Box>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <h1 style={{fontFamily: 'Kanit, sans-serif'}}>Capacity Standard</h1>
            <Capacity />
            
          </Box>
      </Box>
     
    </div>
  );
};

export default MainDash;