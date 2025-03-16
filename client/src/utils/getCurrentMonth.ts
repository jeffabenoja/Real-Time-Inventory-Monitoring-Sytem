const monthOrder = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  
  export default function getCurrentMonth() {
    const currentMonthIndex =  new Date().getMonth(); 
    return monthOrder[currentMonthIndex];
  }


  
