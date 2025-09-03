import React, { useState, useEffect } from "react";
import "./Table.css"
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { db } from "../../services/firebase/firebase"
import { collection, getDoc, doc,onSnapshot, updateDoc } from "firebase/firestore";
import ForecastCell from "./ForecastCell"
import WorkDayCell from "./WorkDayCell"
import TablePlantCell from "./TablePlantCell"
import EffCell from "./EffCell"
import ProductionHrCell from "./ProductionHrCell"
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DownloadIcon from '@mui/icons-material/Download';
import { Button } from '@mui/material';

const MockData = [
  {
    id: "Dny9BE0okm6ORl5V2uPU",
    plants: [
      {
        name: "KKB",
        lines: [
          {
            lineName: "Line1",
            lineType: "Beer Bottle",
            groupProducts: ["Beer"],
            //forecast: 10,
            workingDayPerYear: 290,
            details: [
              {
                brand: "Leo",
                brandMC: "Krones",
                yearOfMachine: "2009",
                sku: "Leo 620 ml",
                size: "0.62",
                speedBph: "40,000",
                productionHrStd: "21.5",
                eff: "88%",
                workDayPerYear: "",
                lineForecast: "",
               
              }
            ]
          },
          {
            lineName: "Line3",
            lineType: "Beer Bottle",
            groupProducts: ["Beer"],
            forecast: 10,
            workingDayPerYear: 290,
            details: [
              {
                brand: "Leo",
                brandMC: "Krones",
                yearOfMachine: "2009",
                sku: "Leo 620 ml",
                size: 0.62,
                speedBph: "50,000",
                productionHrStd: 21.5,
                eff: "90%",
                workDayPerYear: 0,
                lineForecast: 0,
                workDaysRemaining: 0
              }
            ]
          },
          {
            lineName: "Line2",
            lineType: "Beer Bottle",
            groupProducts: ["Beer"],
            forecast: 10,
            workingDayPerYear: 390,
            details: [
              {
                brand: "Leo",
                brandMC: "Krones",
                yearOfMachine: "2009",
                sku: "Leo 620 ml",
                size: 0.62,
                speedBph: "40,000",
                productionHrStd: 21.5,
                eff: "88%",
                image: ""
              },
              {
                brand: "Leo",
                brandMC: "Krones",
                yearOfMachine: "2009",
                sku: "Leo 320 ml",
                size: 0.32,
                speedBph: "40,000",
                productionHrStd: 21,
                eff: "88%",
                capacityLDay: ""
              },
              {
                brand: "Singha",
                brandMC: "Krones",
                yearOfMachine: "2009",
                sku: "Singha 620 ml",
                size: 0.62,
                speedBph: "40,000",
                productionHrStd: 21,
                eff: "88%",
                capacityLDay: ""
              },
              {
                brand: "Singha",
                brandMC: "Krones",
                yearOfMachine: "2009",
                sku: "Singha 320 ml",
                size: 0.32,
                speedBph: "40,000",
                productionHrStd: 21,
                eff: "88%",
                capacityLDay: ""
              }
            ]
          }
        ]
      }
    ],
  },
  {
    id: "Dny9BE0okm6ORl5V2uPU123232",
    plants: [
      {
        name: "SBC",
        lines: [
          {
            lineName: "Line1",
            lineType: "SODA/Water",
            groupProducts: ["S&W"],
            details: [
              {
                brand: "Leo",
                brandMC: "Krones",
                yearOfMachine: "2009",
                sku: "Leo 620 ml",
                size: 0.62,
                speedBph: "40,000",
                productionHrStd: 21.5,
                eff: "88%",
                capacityLDay: "",
                lineForecast: 20,
              }
            ]
          },
          {
            lineName: "Line2",
            lineType: "Beer Bottle",
            groupProducts: ["Beer"],
            details: [
              {
                brand: "Leo",
                brandMC: "Krones",
                yearOfMachine: "2009",
                sku: "Leo 620 ml",
                size: 0.62,
                speedBph: "40,000",
                productionHrStd: 21.5,
                eff: "88%",
                capacityLDay: "",
                lineForecast: 20,
              },
              {
                brand: "Leo",
                brandMC: "Krones",
                yearOfMachine: "2009",
                sku: "Leo 320 ml",
                size: 0.32,
                speedBph: "40,000",
                productionHrStd: 21,
                eff: "88%",
                capacityLDay: "",
                lineForecast: 20,
              },
              {
                brand: "Singha",
                brandMC: "Krones",
                yearOfMachine: "2009",
                sku: "Singha 620 ml",
                size: 0.62,
                speedBph: "40,000",
                productionHrStd: 21,
                eff: "88%",
                capacityLDay: "",
                lineForecast: 20,
              },
              {
                brand: "Singha",
                brandMC: "Krones",
                yearOfMachine: "2009",
                sku: "Singha 320 ml",
                size: 0.32,
                speedBph: "40,000",
                productionHrStd: 21,
                eff: "88%",
                capacityLDay: "",
                lineForecast: 20,
              }
            ]
          }
        ]
      }
    ]
  }
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    fontSize: 18,
    fontFamily: 'Kanit, sans-serif'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));



export default function BasicTable({ 
  selectedGroupProduct, 
  selectedPlant, 
  columns, 
  selectedColumns,
  selectedLines
}) {
  const theme = useTheme();
  const [capacityStandard, setCapacityStandard] = useState([])
  const capacityStandards = collection(db, "capacity_standard")
  const [open, setOpen] = React.useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));
  const [dataModel, setDataModel] = useState([])
  const [dialogTitle, setDialogTitle] = useState({plantName: "", lineName: ""})
  useEffect(() => {
    const unsubscribeCapacityStandards = onSnapshot(capacityStandards, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCapacityStandard(newData);
    });
    
    return () => {
      unsubscribeCapacityStandards(); 
    };
  }, []);


  // const filteredData = capacityStandard.length > 0 
  // ? capacityStandard.flatMap(item => 
    
  //   item.plants.map(plant => ({
  //     ...plant,
  //     documentId: item.id // สมมติว่า documentId อยู่ใน item
  //   }))
  //   ).filter(plant => {
  //     // ตรวจสอบว่า selectedPlant มีค่าอยู่
  //     const isPlantMatch = selectedPlant 
  //       ? plant.name === selectedPlant 
  //       : (selectedLine && selectedLine.firstLetter ? plant.name === selectedLine.firstLetter : true);

  //     // กรอง lines ตาม selectedLine.title และ selectedGroupProduct
  //     const filteredLines = plant.lines.filter(line => {
  //       const isLineMatch = selectedLine && selectedLine.title
  //         ? line.lineName === selectedLine.title
  //         : true;

  //       // ตรวจสอบว่า selectedGroupProduct มีค่าอยู่
  //       const isGroupProductMatch = selectedGroupProduct
  //         ? line.groupProducts.includes(selectedGroupProduct)
  //         : true;

  //       return isLineMatch && isGroupProductMatch;
  //     });

  //     // ตรวจสอบว่า filteredLines มีข้อมูลหรือไม่
  //     return isPlantMatch && filteredLines.length > 0;
      
  //   })
  // : [];

  // const finalFilteredData = filteredData.map(plant => ({
  //   ...plant,
  //   lines: plant.lines.filter(line => {
  //     const isLineMatch = selectedLine && selectedLine.title
  //       ? line.lineName === selectedLine.title
  //       : true;
  
  //     const isGroupProductMatch = selectedGroupProduct
  //       ? line.groupProducts.includes(selectedGroupProduct)
  //       : true;
  //     return isLineMatch && isGroupProductMatch;
  //   })
  // }));

  const finalFilteredData = capacityStandard.length > 0 
  ? capacityStandard.flatMap(item => 
    item.plants.filter(plant => 
      (!selectedPlant || plant.name === selectedPlant) // กรองตาม plant.name
    ).map(plant => ({
      ...plant,
      documentId: item.id,
      lines: plant.lines.filter(line => {
        const isLineMatch = selectedLines.length === 0 || selectedLines.some(selected => 
          selected.title === line.lineName && selected.firstLetter === plant.name // ตรวจสอบว่า title ของ line ตรงกับ selected.title
        );
        // const isLineMatch = !selectedLine || line.lineName === selectedLine.title; // กรองตาม lineName
        const isGroupProductMatch = selectedGroupProduct 
          ? line.groupProducts.includes(selectedGroupProduct) 
          : true; // กรองตาม selectedGroupProduct
        return isLineMatch && isGroupProductMatch;
      })
    })).filter(plant => plant.lines.length > 0)
  ) : []
  

  const calculateCapacityLDay = (detail, line) => {
      // แปลง string เป็นตัวเลขและเอาสัญลักษณ์ที่ไม่ใช่ตัวเลขออก
      const speedBphNum = parseFloat(detail.speedBph.replace(/,/g, '')); // แปลง "40,000" เป็น 40000
      const effNum = parseFloat(detail.eff.replace('%', '')) / 100; // แปลง "88%" เป็น 0.88

      // คำนวณผลลัพธ์
      const result = parseFloat(detail.size * speedBphNum * detail.productionHrStd * effNum);
    
      // ส่งผลลัพธ์ไปยังฟังก์ชัน calculateResultCapacitySTDML เพื่อคำนวณต่อ

      if (line.lineName == "Brew Capacity" || line.lineType == "Brew Capacity") {
        return Math.round("2721600")
      } else if (line.lineName == "Brew 1" || line.lineType == "Brew 1") {
        return Math.round("1043694")
      } else if (line.lineName == "Brew 2" || line.lineType == "Brew 2") {
        return Math.round("1562750")
      } else if (line.lineName == "Small Brewery")  {
        return Math.round("43333")
      } else {
        return Math.round(result);
      }
  };  

  const calculateResultCapacitySTDML = (result) => {
      // หารด้วย 1,000,000 เพื่อแปลงเป็นหน่วยล้าน
      return result / 1000000;
  }

  const calculateCapacityYear = (detail) => {
    const speedBphNumber = parseFloat(detail.speedBph.replace(/,/g, ''));
  
    // แปลง eff จาก string ที่มีเครื่องหมายเปอร์เซ็นต์เป็นตัวเลข
    const effNumber = parseFloat(detail.eff.replace('%', '')) / 100;

    // คำนวณผลลัพธ์
    const result = (detail.size * speedBphNumber * detail.productionHrStd * effNumber * detail.workDayPerYear) / 1000000;
    return result.toFixed(4);
  }

  const roundNumber = (num) => {
    // ตรวจสอบว่าทศนิยม .50 ขึ้นไปหรือไม่ ถ้าใช่ ให้ปัดขึ้น
    const decimal = num % 1;
    if (decimal >= 0.5) {
      return Math.ceil(num); // ปัดขึ้น
    } else {
      return Math.floor(num); // ปัดลง
    }
  };

  

  const calculateFinalResult = (detail, line, data, index) => {
    const total = calculateWorkDays(detail, line, data, index); // คำนวณผลรวม
    let result = total * calculateResultCapacitySTDML(calculateCapacityLDay(detail, line)); 
    return Math.floor(result * 10000) / 10000;
  };

  const calculateForecastCapDay = (detail, line) => {
    let forecast = detail.lineForecast //line.groupProducts.includes("Beer") ? line.forecast : detail.lineForecast
    let result = forecast / calculateResultCapacitySTDML(calculateCapacityLDay(detail, line)); 
    return parseFloat(result.toFixed(4));
  }

  const sumValues = (data) => {
    return data.reduce((sum, value) => sum + value, 0);
  };

  const forecastCapDayValues = finalFilteredData.flatMap(plant =>
    plant.lines.flatMap(line =>
      line.details.map(detail =>
        calculateForecastCapDay(detail, line)
      )
    )
  );

  const totalForecastCapDay = sumValues(forecastCapDayValues).toFixed(2);
  
  const calculateWorkingFromTwohundredAndNinety = (line, data, index) => {
   
    if (!line || !line.workingDayPerYear) {
      return 0; // คืนค่า 0 หากมีค่าที่ไม่ถูกต้อง
    }
    let total = calculateTotalActualWorkingDay(data, index)
    let workingDayPerYear = line.workingDayPerYear;
    let result = workingDayPerYear - total;
    
    // ปัดเศษผลลัพธ์ให้มี 2 ตำแหน่งหลังจุดทศนิยม
    result = Math.round(result * 100) / 100;
    
    return result.toFixed(2);
  }

  const calculateUnitRev = (line, data, index) => {
    let total = calculateTotalActualWorkingDay(data, index)
    if (!line ||  total === 0) {
      return '0%'; // คืนค่าข้อความหากข้อมูลไม่ถูกต้อง
    }
    let workingDayPerYear = line.workingDayPerYear;
    let result = total / workingDayPerYear;
    
    result = Math.round(result * 100);
    // แปลงผลลัพธ์เป็นเปอร์เซ็นต์และแสดง % ต่อท้าย
    return `${result}%`;
  }

  const calculateUtilizationCal = (detail, line, data, index) => {
    let forecast = detail.lineForecast //line.groupProducts.includes("Beer") ? line.forecast : detail.lineForecast;
    let finalResult = calculateFinalResult(detail, line, data, index); // เรียกใช้ฟังก์ชัน calculateFinalResult
    if (finalResult === 0 || isNaN(finalResult)) {
      return "0%"; // หรือจะจัดการตามที่คุณต้องการ
    }
    let result = forecast / finalResult;
    result = (result * 100).toFixed(2); // คำนวณเปอร์เซ็นต์และแสดงผลลัพธ์เป็น 2 ตำแหน่งหลังจุดทศนิยม
    return `${result}%`;
  }

  const calculateUtilizationBudget = (detail, line) => {
    let forecast = parseFloat(detail.lineForecast)//parseFloat(line.groupProducts.includes("Beer") ? line.forecast : detail.lineForecast);
    let finalResult = parseFloat(calculateCapacityMLPerYear(detail, line)) //parseFloat(calculateCapacityYear(detail));

    // ตรวจสอบว่า finalResult เป็น 0 หรือ NaN หรือไม่
    if (isNaN(forecast) || isNaN(finalResult) || finalResult === 0) {
      return "0%"; // หรือข้อความอื่นที่เหมาะสม
  }
  
    let result = forecast / finalResult;
    result = (result * 100).toFixed(2); // คำนวณเปอร์เซ็นต์และแสดงผลลัพธ์เป็น 2 ตำแหน่งหลังจุดทศนิยม
    return `${result}%`;
  }
  
  const calculateActualWorkingDays = (detail, line, data, index) => {
    let total = calculateTotalActualWorkingDay(data, index)
    const forecastCapDay = calculateForecastCapDay(detail, line);
    if (isNaN(forecastCapDay) || isNaN(total) || total === 0) {
      return 0; // คืนค่า 0 หากมีค่าที่ไม่ถูกต้อง
    }
    // คำนวณเปอร์เซ็นต์จาก forecastCapDay และ totalForecastCapDay
    let percentage = (forecastCapDay / total) * 100;
    
    // ปัดเศษเปอร์เซ็นต์ให้มี 2 ตำแหน่งหลังจุดทศนิยม
   //percentage = Math.round(percentage);
    
    return percentage.toFixed(2);
  }

  const calculateWorkDaysRemaining = (detail, line, data, index) => {
    let calWorkingTwoHundred = calculateWorkingFromTwohundredAndNinety(line, data, index)
    let calActualWorking = calculateActualWorkingDays(detail, line, data, index)

    if (isNaN(calWorkingTwoHundred) || isNaN(calActualWorking)) {
      return '0'; // คืนข้อความหากคำนวณไม่ถูกต้อง
    }
    
    let result = calWorkingTwoHundred * (calActualWorking / 100);
    // ปัดเศษผลลัพธ์ขึ้นให้มี 2 ตำแหน่งหลังจุดทศนิยม
   // result = Math.round(result * 1000) / 1000;
    
    // แสดงผลลัพธ์เป็นจำนวนที่มีจุดทศนิยม 2 ตำแหน่ง
    return result.toFixed(4);
  }

  const calculateWorkDays = (detail, line, data, index ) => {
    const forecastCapDay = calculateForecastCapDay(detail, line, data, index);
    const workDaysRemaining = calculateWorkDaysRemaining(detail, line, data, index);

    if (isNaN(forecastCapDay) || isNaN(workDaysRemaining)) {
        return 0; // คืนข้อความหากคำนวณไม่ถูกต้อง
    }

    // รวมผลลัพธ์จากทั้งสองฟังก์ชัน
    let combinedResult = parseFloat(forecastCapDay) + parseFloat(workDaysRemaining);
    
    // ปัดเศษผลลัพธ์ให้มี 2 ตำแหน่งหลังจุดทศนิยม
    //combinedResult = Math.ceil(combinedResult * 100) / 100;

    // แสดงผลลัพธ์เป็นจำนวนที่มีจุดทศนิยม 2 ตำแหน่ง
    return combinedResult.toFixed(4);
  }

  const calculateCapacityMLPerYear = (detail, line) => {
    let workDayPerYear = detail.workDayPerYear
    let result = workDayPerYear * calculateResultCapacitySTDML(calculateCapacityLDay(detail, line)); 
    return parseFloat(result.toFixed(4));
  }
 
  const onUpdate = async (documentId, plantIndex, lineIndex, detailIndex, line, newValue) => {
    const lineField = line.groupProducts.includes("Beer") ? "forecast" : "details";
    
    try {
      const docRef = doc(db, "capacity_standard", documentId);
      
      // if (line.groupProducts.includes("Beer")) {

      //   const docSnap = await getDoc(docRef);

      //   if (docSnap.exists()) {
      //     const data = docSnap.data();
      //     // อัปเดตค่า forecast เท่านั้น โดยข้อมูลอื่นๆ ยังอยู่
      //     data.plants[plantIndex].lines[lineIndex].forecast = newValue;
      //     // อัปเดตเอกสารใน Firestore ด้วยข้อมูลทั้งหมด (รวมถึงข้อมูลอื่นๆ ที่ยังไม่ถูกลบ)
      //     await updateDoc(docRef, data);
      //   } else {
      //     console.log("Document does not exist!");
      //   }
     // } else {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          data.plants[plantIndex].lines[lineIndex].details[detailIndex].lineForecast = newValue;
        
          await updateDoc(docRef, data);
        } 
  //    }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const onUpdateWorkDay = async (documentId, plantIndex, lineIndex, detailIndex, line, newValue) => {
    try {
      const docRef = doc(db, "capacity_standard", documentId);
      const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();

          const workDayPerYear = newValue;
          data.plants[plantIndex].lines[lineIndex].details[detailIndex].workDayPerYear = workDayPerYear;
        
          await updateDoc(docRef, data);
        } 
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const onUpdateEff = async (documentId, plantIndex, lineIndex, detailIndex, line, newValue) => {
    try {
      const docRef = doc(db, "capacity_standard", documentId);
      const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();

          const eff = newValue;
          data.plants[plantIndex].lines[lineIndex].details[detailIndex].eff = eff;
        
          await updateDoc(docRef, data);
        } 
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const onUpdateProductionHr = async (documentId, plantIndex, lineIndex, detailIndex, line, newValue) => {
    try {
      const docRef = doc(db, "capacity_standard", documentId);
      const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();

          const productionHr = newValue
          data.plants[plantIndex].lines[lineIndex].details[detailIndex].productionHrStd = productionHr;
        
          await updateDoc(docRef, data);
        } 
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const calculateTotalCapacityYearBuget = (data) => {
    const total = data?.reduce((total, plant) => {
      return total + (plant?.lines?.reduce((lineTotal, line) => {
        return lineTotal + (line?.details?.reduce((detailTotal, detail) => {
          return detailTotal + parseFloat(calculateCapacityYear(detail)) || 0;
        }, 0) || 0);
      }, 0) || 0);
    }, 0) || 0;
    return total.toFixed(4);
  };

  const calculateTotalCapacityYearCal = (data) => {
    const total = data?.reduce((total, plant) => {
      return total + (plant?.lines?.reduce((lineTotal, line, lineIndex) => {
        return lineTotal + (line?.details?.reduce((detailTotal, detail) => {
          return detailTotal + (parseFloat(calculateFinalResult(detail, line, data, lineIndex)) || 0);
        }, 0) || 0);
      }, 0) || 0);
    }, 0) || 0;

    // จัดรูปแบบผลลัพธ์ให้แสดง 4 ตำแหน่งหลังจุดทศนิยม
    return total.toFixed(4);
  };

  const calculateTotalActualWorkingDay = (data, lineIndex) => {
    
    var result = []; // กำหนด result เป็น array

    if (!data || !Array.isArray(data)) {
      return []; // คืนค่าเป็น array ว่างถ้า data ไม่ถูกต้อง
      
    }

      data.forEach(plantData => {
        if (plantData.lines && Array.isArray(plantData.lines)) {
            plantData.lines.forEach((line, lineIndex) => {
                // ตรวจสอบว่ามี line นี้ใน result แล้วหรือยัง
                const isLineExists = result.find(item => item.lineName === line.lineName);
                if (!isLineExists) {
                  let lineSum = 0;
                  
                  if (line.details && Array.isArray(line.details) && line.details.length > 1) {
                    lineSum = line.details.reduce((total, detail) => {
                      const detailResult = calculateForecastCapDay(detail, line);
                      return total + detailResult;
                    }, 0);
                   
                   
                  } else if (line.details && line.details.length === 1) {
                    // Sum เฉพาะของ line ที่มี details เท่ากับ 1
                    const detail = line.details[0];
                    lineSum = calculateForecastCapDay(detail, line);
                  
                  }
                  // เพิ่มข้อมูลใน array result
                  result.push({
                    index: lineIndex,
                    lineSum: parseFloat(lineSum)
                  });
                }
              });
        }
      });
      
      const matchedResult = result.find(item => item.index === lineIndex);
  
      if (matchedResult) {
        // แสดงผลลัพธ์ที่ตรงกับ lineIndex
        return matchedResult.lineSum
      } else {
        return "0"
      }
    };

  const checkConditionPlant = (plant, line) => {
    if (plant.name === "PTB" && line.groupProducts.includes("Beer")) {
      return <div className="linePTB" onClick={() => handleClickOpen(plant, line)}> {line.lineName} </div>
    } else {
      return <div style={{fontWeight: "bold"}}>{line.lineName}</div>
    }
  }

  const handleClickOpen = (plant, line) => {
    let newData = [{
      documentId: plant.documentId,
      name: plant.name,
      lines: [line]
    }]
    setDialogTitle({plantName: plant.name, lineName: line.lineName})
    setDataModel(newData)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const exportToExcel = async () => {
    if (!finalFilteredData || !Array.isArray(finalFilteredData)) {
        console.error('Invalid data format. Please provide an array of data.');
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Custom headers
    const headers = [
        { header: "Plant", key: "plantName", width: 20 },
        { header: "Line", key: "lineName", width: 20 },
        { header: "Line Type", key: "lineType", width: 20 },
        { header: "Brand", key: "brand", width: 20 },
        { header: "Brand MC", key: "brandMC", width: 20 },
        { header: "ปีติดตั้ง\nเครื่องจักร", key: "yearOfMachine", width: 30 },
        { header: "SKUs", key: "sku", width: 40 },
        { header: "Size", key: "size", width: 10 },
        { header: "Speed (BPH)", key: "speedBph", width: 15 },
        { header: "Working Days/Year", key: "workingDayPerYear", width: 25 },
        { header: "Production\nHr/Day\n(STD)", key: "productionHrStd", width: 25 },
        { header: "`% Eff\n(STD)`", key: "eff", width: 15 },
        { header: "Forecast \n(ML/Year)", key: "lineForecast", width: 20 },
        { header: "Daily Capacity \n(STD) หน่วย L", key: "dailyCapacityL", width: 30 },
        { header: "Daily Capacity \n(STD) หน่วย ML", key: "dailyCapacityML", width: 30 },
        { header: "Forecast/Cap\nต่อวัน", key: "calForecastCapDay", width: 25 },
        { header: "Sum วันทำงานจริง", key: "calTotalActualWorkingDay", width: 25 },
        { header: "วันที่เหลือจาก 290 วัน", key: "calWorkingFromTwohundredAndNinety", width: 25 },
        { header: "%Uti Rev.\n(เพื่อหาจำนวนวันทำงาน)", key: "calUnitRev", width: 25 },
        { header: "สัดส่วนวันทำงานที่ใช้จริง", key: "calActualWorkingDays", width: 25 },
        { header: "วันทำงานที่เหลือ", key: "calWorkDaysRemaining", width: 25 },
        { header: "Working Day \nPer Year \n(Calculated)", key: "calWorkDays", width: 30 },
        { header: "Max Capacity \n(ML) ต่อปี \n(Calculated)", key: "calFinalResult", width: 30 },
        { header: "%Utilization \n(Calculated)", key: "calUtilizationCal", width: 30 },
        { header: "Working Day\n Per Year \n(File Budget)", key: "workDayCell", width: 30 },
        { header: "Max Capacity \n(ML) ต่อปี \n(File Budget)", key: "calCapacityMLPerYear", width: 30 },
        { header: "%Utilization \n(File Budget)", key: "calUtilizationBudget", width: 30 }
    ];

    worksheet.columns = headers;


    finalFilteredData.map((plant, plantIndex) => {
        if (plant.lines && Array.isArray(plant.lines)) {
            plant.lines.map((line, lineIndex) => {
                if (line.details && Array.isArray(line.details)) {
                    line.details.map((detail, detailIndex) => {
                        worksheet.addRow({
                            plantName: plant.name,
                            lineName: line.lineName,
                            lineType: line.lineType,
                            brand: detail.brand,
                            brandMC: detail.brandMC,
                            yearOfMachine: detail.yearOfMachine,
                            workingDayPerYear: line.workingDayPerYear || '',
                            sku: detail.sku,
                            size: detail.size,
                            speedBph: detail.speedBph,
                            productionHrStd: detail.productionHrStd,
                            eff: detail.eff,
                            lineForecast: detail.lineForecast || '',
                            dailyCapacityL: calculateCapacityLDay(detail, line),
                            dailyCapacityML: calculateResultCapacitySTDML(calculateCapacityLDay(detail, line)),
                            calForecastCapDay: calculateForecastCapDay(detail, line),
                            calTotalActualWorkingDay: calculateTotalActualWorkingDay(finalFilteredData, lineIndex),
                            calWorkingFromTwohundredAndNinety: calculateWorkingFromTwohundredAndNinety(line, finalFilteredData, lineIndex),
                            calUnitRev: calculateUnitRev(line, finalFilteredData, lineIndex),
                            calActualWorkingDays: `${calculateActualWorkingDays(detail, line, finalFilteredData, lineIndex)}%`,
                            calWorkDaysRemaining: calculateWorkDaysRemaining(detail, line, finalFilteredData, lineIndex),
                            calWorkDays: calculateWorkDays(detail, line, finalFilteredData, lineIndex),
                            calFinalResult: calculateFinalResult(detail, line, finalFilteredData, lineIndex),
                            calUtilizationCal: calculateUtilizationCal(detail, line, finalFilteredData, lineIndex),
                            workDayCell: detail.workDayPerYear || '',
                            calCapacityMLPerYear: calculateCapacityMLPerYear(detail, line),
                            calUtilizationBudget: calculateUtilizationBudget(detail, line)
                        });
                    });
                }
            });
        }
    });

    // สร้างสไตล์สำหรับ header
    worksheet.getRow(1).height = 50; // Set header height
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fontSize = 11;
    worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };

    headers.forEach((header, index) => {
      const cell = worksheet.getCell(1, index + 1); // Corrected to use offset for cell access
      cell.style = {
          font: { bold: true },
          alignment: { horizontal: "center", vertical: "middle" },
          border: {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
          },
          fill: {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'D3D3D3' } // Default light gray background
          }
      };

      // Set specific header colors
      if (header.key === 'calWorkDays') {
          cell.style.fill.fgColor.argb = 'A8D8B5'; // Light green
      } else if (header.key === 'calFinalResult') {
          cell.style.fill.fgColor.argb = '006400'; // Dark green
      } else if (header.key === 'workDayCell') {
          cell.style.fill.fgColor.argb = 'A2C2E5'; // Light blue
      } else if (header.key === 'calCapacityMLPerYear') {
          cell.style.fill.fgColor.argb = '1A8FE3'; // Dark blue
      } else if (header.key === 'lineForecast') {
        cell.style.fill.fgColor.argb = 'FFFF00'; // Dark blue
      } else if (header.key === 'eff') {
        cell.style.fill.fgColor.argb = 'CCC0DA'; // Dark blue
      }
  });
    

    // ตั้งค่าสีพื้นหลังให้กับเซลล์ที่ระบุ
    const setCellStyle = (rowIndex, columnIndex, fillColor) => {
        const cell = worksheet.getCell(rowIndex, columnIndex);
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: fillColor },
            fontSize: 11
        };
    };

    const rowCount = worksheet.rowCount; // จำนวนแถวทั้งหมด
    for (let i = 2; i <= rowCount; i++) {
        // ตั้งค่าสีพื้นหลังให้กับเซลล์ที่ระบุ
        setCellStyle(i, headers.findIndex(h => h.key === 'calWorkDays') + 1, 'FCD5B4'); // สีเขียวอ่อน
        setCellStyle(i, headers.findIndex(h => h.key === 'calFinalResult') + 1, 'FABF8F'); // สีเขียวเข้ม
        setCellStyle(i, headers.findIndex(h => h.key === 'workDayCell') + 1, 'DAEEF3'); // สีน้ำเงินอ่อน
        setCellStyle(i, headers.findIndex(h => h.key === 'calCapacityMLPerYear') + 1, 'B7DEE8'); // สีน้ำเงินเข้ม
        setCellStyle(i, headers.findIndex(h => h.key === 'eff') + 1, 'E4DFEC'); // สีน้ำเงินเข้ม
    }

    // ผนึกเซลล์สำหรับ plantName
    let previousPlantName = null;
    let startRow = null;
    let previousYearOfMachine = null;
    let yearOfMachineStartRow = null;

    let previousLineName = null;
    let lineNameStartRow = null;

    for (let i = 2; i <= rowCount; i++) {
        const currentPlantName = worksheet.getCell(i, 1).value;
        const currentYearOfMachine = worksheet.getCell(i, headers.findIndex(h => h.key === 'yearOfMachine') + 1).value;
        const currentLineName = worksheet.getCell(i, headers.findIndex(h => h.key === 'lineName') + 1).value;

        if (currentPlantName === previousPlantName) {
            if (startRow === null) {
                startRow = i - 1; // เริ่มผนึกจากแถวก่อนหน้า
            }
        } else {
            if (startRow !== null) {
                worksheet.mergeCells(startRow, 1, i - 1, 1); // ผนึกเซลล์
                startRow = null; // รีเซ็ตการเริ่มต้น
            }
        }
        previousPlantName = currentPlantName;

        if (currentYearOfMachine === previousYearOfMachine) {
          if (yearOfMachineStartRow === null) {
              yearOfMachineStartRow = i - 1; // เริ่มผนึกจากแถวก่อนหน้า
          }
        } else {
            if (yearOfMachineStartRow !== null) {
                worksheet.mergeCells(yearOfMachineStartRow, headers.findIndex(h => h.key === 'yearOfMachine') + 1, i - 1, headers.findIndex(h => h.key === 'yearOfMachine') + 1); // ผนึกเซลล์
                yearOfMachineStartRow = null; // รีเซ็ตการเริ่มต้น
            }
        }
        previousYearOfMachine = currentYearOfMachine;


        if (currentLineName === previousLineName) {
          if (lineNameStartRow === null) {
            lineNameStartRow = i - 1; // เริ่มผนึกจากแถวก่อนหน้า
          }
        } else {
            if (lineNameStartRow !== null) {
                worksheet.mergeCells(lineNameStartRow, headers.findIndex(h => h.key === 'lineName') + 1, i - 1, headers.findIndex(h => h.key === 'lineName') + 1); // ผนึกเซลล์
                lineNameStartRow = null; // รีเซ็ตการเริ่มต้น
            }
        }
        previousLineName = currentLineName;
    }

    // ตรวจสอบว่ามีการผนึกในแถวสุดท้าย
    if (startRow !== null) {
        worksheet.mergeCells(startRow, 1, rowCount, 1); // ผนึกเซลล์สำหรับแถวสุดท้าย
    }

    if (yearOfMachineStartRow !== null) {
      worksheet.mergeCells(yearOfMachineStartRow, headers.findIndex(h => h.key === 'yearOfMachine') + 1, rowCount, headers.findIndex(h => h.key === 'yearOfMachine') + 1); // ผนึกเซลล์สำหรับแถวสุดท้าย
    }

    if (lineNameStartRow !== null) {
      worksheet.mergeCells(lineNameStartRow, headers.findIndex(h => h.key === 'lineName') + 1, rowCount, headers.findIndex(h => h.key === 'lineName') + 1); // ผนึกเซลล์สำหรับแถวสุดท้าย
    }
    

    // ตั้งค่าการจัดตำแหน่งเซลล์ที่ผนึก
    for (let i = 2; i <= rowCount; i++) {
        const cell = worksheet.getCell(i, 1);
        if (cell.value === previousPlantName) {
            cell.alignment = { horizontal: "center", vertical: "middle" }; // จัดตำแหน่งให้อยู่กลาง
        }
    }

    // เพิ่มกรอบและจัดให้เซลล์อยู่กลาง
    for (let i = 1; i <= rowCount; i++) {
      for (let j = 1; j <= headers.length; j++) {
          const cell = worksheet.getCell(i, j);
          cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
          };
          cell.alignment = { horizontal: 'center', vertical: 'middle' }; // จัดตำแหน่งกลาง
      }
    }

    // บันทึกไฟล์
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "ExportedData.xlsx");
};

  return (
   <>
   <div>
   {(selectedPlant || selectedGroupProduct || selectedLines.length > 0) && finalFilteredData.length > 0 && (
   <Button
      variant="outlined" // ทำให้ปุ่มมีกรอบ
      onClick={exportToExcel}
      startIcon={<FileDownloadIcon />} // เพิ่มไอคอนไว้หน้าข้อความปุ่ม
      sx={{
        color: '#1976d2',
        borderColor: '#1976d2',
        padding: '10px 20px',
        margin: "8px 8px 8px 8px",
        fontSize: '14px',
        fontWeight: 'bold',
        textTransform: 'none',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          backgroundColor: '#1976d2',
          color: '#fff',
        },
        '@media (max-width: 600px)': {
          padding: '8px 16px',
          fontSize: '0.875rem',
        },
      }}
    >
      Export to Excel
    </Button>
   )}
   </div>
    <TableContainer className="table-wrapper" 
    sx={{ 
      maxHeight: 650, 
      overflowX: 'auto', // เพิ่ม overflow เพื่อให้ตาราง scroll ได้
      boxShadow: '0px 14px 15px rgba(0, 0, 0, 0.1)',
      '@media (max-width: 600px)': { // media query สำหรับ mobile
        maxHeight: 500, // ปรับขนาดความสูงสำหรับหน้าจอเล็ก
        width: '100%', // ทำให้ตารางขยายตามความกว้างของหน้าจอ
      }
    }}
    component={Paper}>
      <Table stickyHeader className="responsive-table" aria-label="sticky table">
        <TableHead>
          <TableRow>
            {columns.map((column) =>
                selectedColumns.includes(column.id) ? (
                  <StyledTableCell dangerouslySetInnerHTML={{ __html: column.label }} key={column.id} style={{fontWeight: "bold", fontSize: "15px"}} align="center"/>
                 
                ) : null
              )}
          </TableRow>
          
        </TableHead>
        <TableBody>
        {(selectedPlant || selectedGroupProduct || selectedLines.length > 0) && finalFilteredData.length > 0 ? (
            finalFilteredData.map((plant, plantIndex) => (
              plant.lines
              .map((line, lineIndex) => {
                const rowSpan = line.details.length || 1;
                return line.details.map((detail, detailIndex) => (
                  <TableRow
                    key={`${plantIndex}-${lineIndex}-${detailIndex}`}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    {columns.map((column) =>
                      selectedColumns.includes(column.id) ? (
                    <>
                    {detailIndex === 0 && (
                      <>
                        {column.id === '1' && <TableCell align="center" rowSpan={rowSpan}>{checkConditionPlant(plant, line)}</TableCell>}
                        {column.id === '2' && <TableCell align="center" rowSpan={rowSpan}>{line.lineType}</TableCell>}
                        
                      </>
                    )}
                    {column.id === '3' && <TableCell align="center">{detail.brand == "" ? <div className="no-data">ไม่พบข้อมูล</div> : detail.brand}</TableCell>}

                    {column.id === '4' && <TableCell align="center">
                      {detail.brandMC == "" ? 
                      <div className="no-data">ไม่พบข้อมูล</div>
                        : detail.brandMC }
                      </TableCell>}
                    
                    {detailIndex === 0 && (
                      <>
                      {column.id === '5' && <TableCell align="center" rowSpan={rowSpan}>
                        {detail.yearOfMachine == "" ? <div className="no-data">ไม่พบข้อมูล</div> : detail.yearOfMachine}
                        </TableCell>}
                        
                      </>
                    )}
                    {column.id === '6' && <TableCell align="center">{detail.sku == "" ? <div className="no-data">ไม่พบข้อมูล</div> : detail.sku}</TableCell>}
                    {column.id === '7' && <TableCell align="center">{detail.size}</TableCell>}
                    {column.id === '8' && <TableCell align="center">{detail.speedBph}</TableCell>}

                    
                    {column.id === '9' &&
                      <EffCell
                        documentId={plant.documentId}
                        plantIndex={plantIndex}
                        lineIndex={lineIndex}
                        line={line}
                        detail={detail}
                        detailIndex={detailIndex}
                        onUpdateEff={onUpdateEff}
                      />}
                  
                  {column.id === '10' &&
                    <ProductionHrCell
                      documentId={plant.documentId}
                      plantIndex={plantIndex}
                      lineIndex={lineIndex}
                      line={line}
                      detail={detail}
                      detailIndex={detailIndex}
                      onUpdateProductionHr={onUpdateProductionHr}
                    />
                    }
                    {detailIndex === 0 && (
                      <>
                      {column.id === '11' && <TableCell align="center" rowSpan={rowSpan}>{line.workingDayPerYear}</TableCell>}
                        
                      </>
                    )}
                    
                    {column.id === '12' && 
                    <ForecastCell
                      documentId={plant.documentId}
                      plantIndex={plantIndex}
                      lineIndex={lineIndex}
                      line={line}
                      detail={detail}
                      rowSpan={rowSpan}
                      detailIndex={detailIndex}
                      onUpdate={onUpdate}
                    />
                    }
                     {column.id === '13' && <TableCell align="center">{calculateCapacityLDay(detail, line)}</TableCell>}
                     {column.id === '14' && <TableCell  align="center">{calculateResultCapacitySTDML(calculateCapacityLDay(detail, line))}</TableCell>}

                     {column.id === '15' && <TableCell  align="center">{calculateForecastCapDay(detail, line)}</TableCell>}
                    {detailIndex === 0 && (
                      <>
                      {column.id === '16' &&
                        <TableCell  align="center" rowSpan={rowSpan}>
                          {calculateTotalActualWorkingDay(finalFilteredData, lineIndex)}
                        </TableCell>
                      }
                      </>
                    )}

                  {detailIndex === 0 && (
                    <>
                    {column.id === '17' &&
                   <TableCell rowSpan={rowSpan} align="center">
                     {calculateWorkingFromTwohundredAndNinety(line, finalFilteredData, lineIndex)}
                    </TableCell>
                  }
                  </>
                  )}
                    {detailIndex === 0 && (
                      <>
                      {column.id === '18' &&
                      <TableCell rowSpan={rowSpan} align="center">
                      {calculateUnitRev(line, finalFilteredData, lineIndex)}
                      </TableCell>
                      }
                      </>
                    )}
                    {column.id === '19' &&
                    <TableCell align="center">
                     {`${calculateActualWorkingDays(detail, line, finalFilteredData, lineIndex)}%`}
                    </TableCell>}

                    {column.id === '20' &&
                    <TableCell align="center">
                     {calculateWorkDaysRemaining(detail, line, finalFilteredData, lineIndex)}
                    </TableCell>}
                    
                    {column.id === '21' &&
                    <TableCell style={{background: "#FAF0E6", color: "#000000", fontWeight: "bold"}} align="center">
                      {calculateWorkDays(detail, line, finalFilteredData, lineIndex)}
                    </TableCell>}

                    {column.id === '22' &&
                    <TableCell style={{background: "#FAEBD7", color: "#000000", fontWeight: "bold"}} align="center">
                      
                      {calculateFinalResult(detail, line, finalFilteredData, lineIndex)}
                    </TableCell>}

                    {column.id === '23' &&
                    <TableCell style={{background: "#FAF0E6", color: "#000000", fontWeight: "bold"}} align="center">
                    {calculateUtilizationCal(detail, line, finalFilteredData, lineIndex)}
                    </TableCell>
                    }


                  {column.id === '24' &&
                    <WorkDayCell
                      documentId={plant.documentId}
                      plantIndex={plantIndex}
                      lineIndex={lineIndex}
                      line={line}
                      detail={detail}
                      detailIndex={detailIndex}
                      onUpdateWorkDay={onUpdateWorkDay}
                    />}

                    {column.id === '25' &&
                    <TableCell style={{background: "#87CEFA", color: "#000000", fontWeight: "bold"}} align="center">
                      {calculateUtilizationBudget(detail, line)}
                    </TableCell>}
                    
                    {column.id === '26' &&
                    <TableCell style={{background: "#ADD8E6", color: "#000000", fontWeight: "bold"}} align="center">
                      {/* {calculateCapacityYear(detail)} */}
                      {calculateCapacityMLPerYear(detail, line)}
                    </TableCell>}
                    </>
                    ) : null
                    )}
                  </TableRow>
                  
                ));
              })
            ))
        
          ) : (
            <TableRow>
              <TableCell style={{fontFamily: 'Kanit, sans-serif', fontWeight: "bold", fontSize: "20px"}} align="center" colSpan={16}>ไม่พบข้อมูล</TableCell>
            </TableRow>
          )}
           
          {(selectedPlant || selectedGroupProduct || selectedLines.length > 0) && finalFilteredData.length > 0 && (
            <>
            <TableRow>
            <TableCell colSpan={20} />
            </TableRow>
          <TableRow>
            <TableCell colSpan={13} />
            <TableCell colSpan={3}>Capacity year ML (Calc)</TableCell>
            <TableCell colSpan={2}  align="center" style={{ background: "#FAEBD7", fontWeight: 'bold' }}>
            {calculateTotalCapacityYearCal(finalFilteredData)}
            </TableCell>
          </TableRow>
        
          <TableRow>
          <TableCell colSpan={13} />
            <TableCell colSpan={3}>Capacity year ML (budget)</TableCell>
            <TableCell colSpan={2}  align="center" style={{ background: "#ADD8E6", fontWeight: 'bold' }}>
            {calculateTotalCapacityYearBuget(finalFilteredData)}
            </TableCell>
          </TableRow>
          </>
           )}
        </TableBody>
      </Table>
    </TableContainer>
    <Dialog
        fullWidth={true}
        maxWidth={"xl"} 
        open={open}
        onClose={handleClose}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} style={{fontFamily: 'Kanit, sans-serif'}} id="customized-dialog-title">
         [{dialogTitle.plantName} - {dialogTitle.lineName}] - คำนวณ Capacity โดยใช้ Max Vol. กับ Max Speed ของ Line นั้น
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <TablePlantCell 
          selectedGroupProduct={selectedGroupProduct}
          selectedPlant={selectedPlant}
          selectedLines={selectedLines}
          columns={columns}
          selectedColumns={selectedColumns}
          dataModel={dataModel}
          />
        </DialogContent>
    </Dialog>
    </>
  );
}