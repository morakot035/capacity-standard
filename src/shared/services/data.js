// Sidebar imports
import {
    UilEstate,
    UilClipboardAlt,
    UilUsersAlt,
    UilPackage,
    UilChart,
    UilSignOutAlt,
  } from "@iconscout/react-unicons";
  
  // Sidebar Data
  export const SidebarData = [
    {
      icon: UilEstate,
      heading: "Capacity",
      path: "/"
    },
    {
      icon: UilPackage,
      heading: 'Products',
      path: "/product"
    },
    {
      icon: UilClipboardAlt,
      heading: "Plant",
      path: "/plant"
    }
  ];
  
  
  const columns = [
    { id: 'Line', label: 'Line' },
    { id: 'Line Type', label: 'Line Type' },
    { id: 'Brand', label: 'Brand' },
    { id: 'Brand (M/C)', label: 'Brand (M/C)' },
    { id: 'Year', label: 'Year' },
    { id: 'SKUs', label: 'SKUs' },
    { id: 'Size', label: 'Size' },
    { id: 'BranSpeed (bpt)d', label: 'Speed (bpt)' },
    { id: `% Eff (STD)`, label: `% Eff (STD)` },
    { id: `Production Hr.(STD)`, label: `Production Hr.(STD)` },
    { id: `WORKING DAYS (Days/Year) PER YEAR`, label: `WORKING DAYS (Days/Year) PER YEAR` },
    { id: `Forecast ML./Year`, label: `Forecast ML./Year` },
    { id: `Cap (L/Day)`, label: `Cap (L/Day)` },
    { id: `Cap (ML/Day)`, label: `Cap (ML/Day)` },
    { id: `Forecast/Capต่อวัน`, label: `Forecast/Capต่อวัน` },
    { id: `Sumวันทำงานจริง`, label: `Sumวันทำงานจริง` },
    { id: 'วันที่เหลือจาก 290 วัน', label: 'วันที่เหลือจาก 290 วัน' },
    { id: '%Uti Rev.', label: '%Uti Rev.' },
    { id: 'สัดส่วนวันทำงานที่ใช้จริง', label: 'สัดส่วนวันทำงานที่ใช้จริง' },
    { id: 'วันทำงานที่เหลือ', label: 'วันทำงานที่เหลือ' },
    { id: `Working Days per year (Calc)`, label: `Working Days per year (Calc)` },
    { id: `Capacity year(Calc)`, label: `Capacity year(Calc)` },
    { id: `%UTILIZATION(Calc)`, label: `%UTILIZATION(Calc)` },
    { id: `Working Days per year (budget)`, label: `Working Days per year (budget)` },
    { id: `%UTILIZATION(budget)`, label: `%UTILIZATION(budget)` },
    { id: `Capacity year(budget)`, label: `Capacity year(budget)` }
  ];
