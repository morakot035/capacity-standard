import React, { useState } from "react";
import { Box,Button, Typography, TextField } from "@mui/material"
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../../firebase/auth"
import { useAuth } from "./../../context"
import { Navigate, Link } from 'react-router-dom'
import Alert from '@mui/material/Alert';
import GoogleIcon from '@mui/icons-material/Google'; 
import Logo from "./../../images/logo.png";
import BG from "./../../images/bg.JPG";

const Root = styled('div')(({ theme }) => ({
    width: '100%',
    marginTop: 30,
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    '& > :not(style) ~ :not(style)': {
      marginTop: theme.spacing(10),
    },
  }));
  

const Auth = () => {
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    })
    const [isSigningIn, setIsSigningIn] = useState(false)
    const { userLoggedIn } = useAuth()
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name] : e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!inputs.email || !inputs.password) {
            setErrorMessage("กรุณากรอกอีเมลและรหัสผ่าน");
            return; // หยุดการทำงานถ้าเจอค่าว่าง
        }

        if(!isSigningIn) {
            setIsSigningIn(true)
            await doSignInWithEmailAndPassword(inputs.email, inputs.password)
            .then(data => {
                setErrorMessage("");
            }).catch(err => {
                setErrorMessage("อีเมล หรือ รหัสผ่าน ไม่ถูกต้องกรุณาตรวจสอบอีกครั้ง");
            })
            .finally(() => {
                setIsSigningIn(false); // reset loading state
            });
        }
    }

    const onGoogleSignIn = (e) => {
        e.preventDefault()
        if (!isSigningIn) {
            setIsSigningIn(true)
            doSignInWithGoogle().catch(err => {
                setIsSigningIn(false)
            })
        }
    }

    return (
        <div style={{
            backgroundImage: `url(${BG})`, // ใส่ URL รูปภาพที่ต้องการ
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh", // ทำให้รูปพื้นหลังยาวเต็มหน้าจอ
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            {userLoggedIn && (<Navigate to={'/mainDash'} replace={true} />)}
            <form onSubmit={handleSubmit}>
                <Box 
                    display="flex" 
                    flexDirection={"column"} 
                    maxWidth={500} 
                    alignItems={"center"}
                    justifyContent={"center"}
                    margin={"auto"}
                    marginTop={5}
                    backgroundColor={"#fff"}
                    padding={3}
                    fontFamily={'Kanit, sans-serif'}
                    borderRadius={5}
                    boxShadow={"5px 5px 10px #000"}
                    sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)", // พื้นหลังโปร่งใส
                        zIndex: 1, // ทำให้ Box อยู่เหนือ background image
                        position: "relative", // จัดการตำแหน่งให้อยู่บนสุด
                        ":hover": {
                          boxShadow: "10px 10px 20px #000",
                        }
                      }}
                >
                    <Typography fontFamily={'Kanit, sans-serif'} variant="h2" padding={0} textAlign={"center"}>
                        <img src={Logo} width="150px" height={"150px"}  />
                    </Typography>
                    <TextField 
                        onChange={handleChange} 
                        name="email" 
                        value={inputs.email} 
                        margin="normal" 
                        type={"email"} 
                        variant="outlined" 
                        placeholder="Email"
                        style={{ width: '400px' }} 
                    >
                        
                    </TextField>
                    <TextField 
                    style={{ width: '400px' }}
                    onChange={handleChange} name="password" value={inputs.password} margin="normal" type={"password"} variant="outlined" placeholder="Password" ></TextField>
                    
                    {errorMessage && (
                        <Alert severity="error">
                            {errorMessage}
                        </Alert>
                    )}
                    
                    <Button 
                    disabled={isSigningIn}
                    endIcon={<LoginOutlinedIcon />}
                    type="submit"
                    style={{fontFamily: 'Kanit, sans-serif'}}
                    sx={{
                        marginTop: 3,
                        borderRadius: 3,
                        width: "160px"
                    }}
                    variant="contained" color="primary">
                        {isSigningIn ? 'กำลังเข้าสู่ระบบ...' : 'Login'}
                    </Button>

                    <Root>
                        <Divider>OR</Divider>
                    </Root>
                    <Button
                        variant="contained"
                        startIcon={<GoogleIcon />} // ไอคอน Google
                        sx={{
                            backgroundColor: "#4285F4", // สีพื้นหลังตามสไตล์ของ Google
                            color: "white",
                            "&:hover": {
                            backgroundColor: "#357ae8", // เปลี่ยนสีเมื่อ hover
                            },
                            marginTop: "20px",
                            padding: "10px 20px",
                            textTransform: "none", // ปิดการแปลงข้อความเป็นตัวพิมพ์ใหญ่
                            fontFamily: 'Kanit, sans-serif'
                        }}
                        >
                        Sign in with Google
                    </Button>
                </Box>

            </form>
        </div>
    )
}

export default Auth