import dotenv from 'dotenv'
import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import router from './routes/index.js'
import instanceMongoDb from './dbs/connect.mongodb.js'
import { v2 as cloudinary } from 'cloudinary';
import { Server } from 'socket.io'
import http from 'http';
import cron from 'node-cron'
import bookingService from './services/booking.service.js'
import { STARTDATE_SLOT1, ENDDATE_SLOT1, STARTDATE_SLOT2, ENDDATE_SLOT2, STARTDATE_SLOT3, ENDDATE_SLOT3, STARTDATE_SLOT4, ENDDATE_SLOT4, STARTDATE_SLOT5, ENDDATE_SLOT5, STARTDATE_SLOT6, ENDDATE_SLOT6, STARTDATE_SLOT7, ENDDATE_SLOT7, STARTDATE_SLOT8, ENDDATE_SLOT8, STARTDATE_SLOT9, ENDDATE_SLOT9 } from '../src/Enum/DateTimeSlot.js';
import { fileURLToPath } from 'url';
import importExcelToDb from './utils/importExcel.js'
import path from 'path';
import multer from 'multer'; // Đảm bảo nhập multer


const upload = multer({ dest: 'uploads/' }); // Thay đổi đường dẫn nếu cần

// Route để tải lên cơ sở
// Tạo mảng chứa các time slot
const timeSlots = [
    { startTime: STARTDATE_SLOT1, endTime: ENDDATE_SLOT1 },
    { startTime: STARTDATE_SLOT2, endTime: ENDDATE_SLOT2 },
    { startTime: STARTDATE_SLOT3, endTime: ENDDATE_SLOT3 },
    { startTime: STARTDATE_SLOT4, endTime: ENDDATE_SLOT4 },
    { startTime: STARTDATE_SLOT5, endTime: ENDDATE_SLOT5 },
    { startTime: STARTDATE_SLOT6, endTime: ENDDATE_SLOT6 },
    { startTime: STARTDATE_SLOT7, endTime: ENDDATE_SLOT7 },
    { startTime: STARTDATE_SLOT8, endTime: ENDDATE_SLOT8 },
    { startTime: STARTDATE_SLOT9, endTime: ENDDATE_SLOT9 }
];

dotenv.config()
const app = express()
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: "GET, POST, PUT, DELETE, OPTIONS",
}))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const importExcelToDb = require("./utils/importExcel");

app.post('/facility/import', upload.single('file'), (req, res) => {
    // Lấy đường dẫn file được upload
    const filePath = path.resolve(req.file.path);
    // const filePath = path.join(__dirname, req.file.path);
    console.log(`File path: ${filePath}`); // Kiểm tra đường dẫn file

    // Gọi hàm để import dữ liệu từ file Excel vào MongoDB
    importExcelToDb(filePath)
        .then(() => res.send('Import thành công vào MongoDB'))
        .catch((error) => res.status(500).send('Lỗi khi import: ' + error));
});
// init middlewares
app.use(morgan("dev"))
app.use(helmet()) // khong bi lo minh dung phan mem gi
app.use(compression()) //compression giup van chuyen giam bot mb
app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
const server = http.createServer(app);
const socketIo = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Enable credentials (important for cookies and authentication)
    },
});


//init router 
app.use(router);

//init socket
const connectedUsers = {};
const connectedAdmin = {};
socketIo.on('connection', (socket) => {

    socket.on('storeUserId', (id) => {
        connectedUsers[id] = socket.id;
    })

    socket.on('storeAdminId', (id) => {
        connectedAdmin[id] = socket.id;
    })

    socket.on('privateMessage', async ({ sender, receiver, message }) => {
        console.log(sender, receiver, message);
        if (receiver && receiver != undefined) {
            let receiverSocketId = connectedUsers[receiver];
            try {
                // Send the message to the receiver only
                socketIo.to(receiverSocketId).emit('privateMessage', {
                    sender,
                    message,
                });
            } catch (error) {
                console.error('Error saving message to the database:', error);
            }
        } else {
            // Send message to list admin
            for (const key in connectedAdmin) {
                const adminSocketId = connectedAdmin[key];
                socketIo.to(adminSocketId).emit('privateMessage', {
                    sender,
                    message
                })
            }
        }
    });
});

// cron job for run every day at 00:00
cron.schedule('* * * * *', async () => {
    console.log("Start clean booking expried!!!");
    await bookingService.CheckExpireBooking();
    await bookingService.checkBookingExpire5();

})
// Cấu hình cron job để chạy vào mỗi ngày lúc 09:00:00 và các thời điểm khác theo yêu cầu
cron.schedule('30 7 * * *', async () => {
    await bookingService.CheckUnusedBooking('Slot1');
});
cron.schedule('10 9 * * *', async () => {
    await bookingService.CheckUnusedBooking('Slot2');
});
cron.schedule('50 10 * * *', async () => {
    await bookingService.CheckUnusedBooking('Slot3');
});
cron.schedule('50 12 * * *', async () => {
    await bookingService.CheckUnusedBooking('Slot4');
});
cron.schedule('30 14 * * *', async () => {
    await bookingService.CheckUnusedBooking('Slot5');
});
cron.schedule('10 16 * * *', async () => {
    await bookingService.CheckUnusedBooking('Slot6');
});
cron.schedule('50 17 * * *', async () => {
    await bookingService.CheckUnusedBooking('Slot7');
});
cron.schedule('30 19 * * *', async () => {
    await bookingService.CheckUnusedBooking('Slot8');
});
cron.schedule('10 21 * * *', async () => {
    await bookingService.CheckUnusedBooking('Slot9');
});

// handling catch error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

// config cloudianry
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    })
})

export default server