interface SlotTimeType {
  [key: string]: string;
}

export const weekOptions = [
  "01/01 To 07/01",
  "08/01 To 14/01",
  "15/01 To 21/01",
  "22/01 To 28/01",
  "29/01 To 04/02",
  "05/02 To 11/02",
  "12/02 To 18/02",
  "19/02 To 25/02",
  "26/02 To 03/03",
  "04/03 To 10/03",
  "11/03 To 17/03",
  "18/03 To 24/03",
  "25/03 To 31/03",
  "01/04 To 07/04",
  "08/04 To 14/04",
  "15/04 To 21/04",
  "22/04 To 28/04",
  "29/04 To 05/05",
  "06/05 To 12/05",
  "13/05 To 19/05",
  "20/05 To 26/05",
  "27/05 To 02/06",
  "03/06 To 09/06",
  "10/06 To 16/06",
  "17/06 To 23/06",
  "24/06 To 30/06",
  "01/07 To 07/07",
  "08/07 To 14/07",
  "15/07 To 21/07",
  "22/07 To 28/07",
  "29/07 To 04/08",
  "05/08 To 11/08",
  "12/08 To 18/08",
  "19/08 To 25/08",
  "26/08 To 01/09",
  "02/09 To 08/09",
  "09/09 To 15/09",
  "16/09 To 22/09",
  "23/09 To 29/09",
  "30/09 To 06/10",
  "07/10 To 13/10",
  "14/10 To 20/10",
  "21/10 To 27/10",
  "28/10 To 03/11",
  "04/11 To 10/11",
  "11/11 To 17/11",
  "18/11 To 24/11",
  "25/11 To 01/12",
  "02/12 To 08/12",
  "09/12 To 15/12",
  "16/12 To 22/12",
  "23/12 To 29/12",
];

export const getCurrentWeekTime = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const diff = currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
  const startOfWeek = new Date(currentDate.setDate(diff));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  const startDateFormat = `${startOfWeek.getDate()}/${startOfWeek.getMonth() + 1}`;
  const endDateFormat = `${endOfWeek.getDate()}/${endOfWeek.getMonth() + 1}`;

  const stringSearch = `${startOfWeek.getDate() < 10 ? `0${startOfWeek.getDate()}` : `${startOfWeek.getDate()}`}/${startOfWeek.getMonth() + 1 < 10 ? `0${startOfWeek.getMonth() + 1}` : `${startOfWeek.getMonth() + 1}`} To ${endOfWeek.getDate() < 10 ? `0${endOfWeek.getDate()}` : `${endOfWeek.getDate()}`}/${endOfWeek.getMonth() + 1 < 10 ? `0${endOfWeek.getMonth() + 1}` : `${endOfWeek.getMonth() + 1}`}`;

  console.log("Searching for:", stringSearch);
  console.log("Array:", weekOptions);

  const index = weekOptions.findIndex((week) => week === stringSearch);
  console.log("Index:", index);

  return index;
};


export const statusFilter = [1, 2, 3, 4];

export const years = () => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const startYear = 2000;
  const array: string[] = [];

  for (let year = startYear; year <= currentYear; year++) {
    array.push(String(year));
  }

  return array.sort((a, b) => {
    return Number(b) - Number(a);
  });
};

export const SlotTime: SlotTimeType = {
  Slot1: "7h30 to 9h00",
  Slot2: "9h10 to 10h40",
  Slot3: "10h50 to 12h10",
  Slot4: "12h50 to 14h20",
  Slot5: "14h30 to 16h",
  Slot6: "16h10 to 17h40",
  Slot7: "17h50 to 19h20",
  Slot8: "19h30 to 21h",
  Slot9: "21h10 to 22h40",
};
