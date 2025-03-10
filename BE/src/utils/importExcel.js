import xlsx from "xlsx";
import Facility from "../models/Facility.js";

const importExcelToDb = async (filePath) => {
  try {
    // Đọc file Excel
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Chuyển dữ liệu sang dạng JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Xử lý dữ liệu (nếu cần thiết)
    const formattedData = jsonData.map((item) => ({
      name: item["Name"], // Chuyển đổi tên cột thành tên trường MongoDB
      category: item["Category"],
      image: item["Image"],
      status: item["Status"] || 1 , // Giá trị mặc định nếu không có
      location: item["Location"],
      description: item["Description"],
      shortTitle: item["ShortTitle"],
      modifileBy: item["ModifileBy"],
      createdBy: item["CreatedBy"],
    }));

    // Lưu dữ liệu vào MongoDB và lưu kết quả trả về
    const insertedData = await Facility.insertMany(formattedData);
    
    // Log dữ liệu đã được chèn vào MongoDB
    console.log("Dữ liệu đã được lưu thành công vào MongoDB:", insertedData);
    
    return insertedData;
  } catch (error) {
    console.error("Lỗi trong quá trình import:", error);
    throw error; // Ném lỗi để có thể xử lý tại nơi gọi hàm
  }
};

export default importExcelToDb;
