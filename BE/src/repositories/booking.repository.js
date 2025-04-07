import mongoose from 'mongoose';
import Booking from '../models/Booking.js'
import { Types } from 'mongoose';
import { ENDDATE_SLOT1, ENDDATE_SLOT2, ENDDATE_SLOT3, ENDDATE_SLOT4, ENDDATE_SLOT5, ENDDATE_SLOT6, ENDDATE_SLOT7, ENDDATE_SLOT8, ENDDATE_SLOT9, STARTDATE_SLOT1, STARTDATE_SLOT2, STARTDATE_SLOT3, STARTDATE_SLOT4, STARTDATE_SLOT5, STARTDATE_SLOT6, STARTDATE_SLOT7, STARTDATE_SLOT8, STARTDATE_SLOT9 } from '../Enum/DateTimeSlot.js';
import User from '../models/User.js';
import Facility from '../models/Facility.js';
import { notificationService } from '../services/index.js';
import Notification from '../models/Notification.js';
import { ObjectId } from 'mongoose';
import moment from 'moment';
const FindAll = async (req) => {

    const userProjecttion = {
        createdAt: 0,
        updatedAt: 0,
        id: 0
    }
    // Xử lý thông tin sort
    let sortOptions = {};
    const { sort, role, status, weeks, name, sortBeside } = req.query;
    if (sort) {
        const sortFields = Array.isArray(sort) ? sort : [sort];
        sortFields.forEach(sortField => {
            const [field, order] = sortField.split(':');
            sortOptions[field] = (order === 'asc' ? 1 : -1);
        });
    }
    console.log(sort);
    console.log(sortOptions);
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 5;
    const startIndex = (page - 1) * size;
    let query = {};

    if (weeks) {
        query = { weeks: { $regex: weeks, $options: 'i' }, status: 2 }
    }
    if (status) {
        if (status == 2) {

            query = { ...query, status: { $in: [2, 5] } };
        } else {

            query = { ...query, status: status };
        }
        console.log(status);
        console.log(query);
    }

    // return await Booking.find({ status: 2 }).sort({ createdAt: -1 });
    let existedUser = await Booking.find(query).sort(sortOptions)
        .populate({
            path: 'booker',
            populate: {
                path: 'roleId',
                select: userProjecttion,
            }
        })
        .populate({ path: 'facilityId', select: userProjecttion })
        .populate({ path: 'handler', select: userProjecttion })

        .exec();
    console.log(existedUser);
    let arrangeSeven = [];

    let total = await Booking.countDocuments(query);

    // Lọc theo role nếu được chỉ định
    if (role) {
        const roleId = new mongoose.Types.ObjectId(role);
        existedUser = existedUser.filter(book => book.booker && book.booker.roleId['_id'].equals(roleId));
    }

    // Lọc theo tên facility nếu được chỉ định
    if (name) {
        const searchName = name.toLowerCase();
        existedUser = existedUser.filter(book => book.facilityId && book.facilityId.name.toLowerCase().includes(searchName));
    }
    if (weeks) {
        arrangeSeven = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: [],
        }
        // Chuyển đổi các đối tượng Mongoose thành đối tượng JavaScript thuần túy
        // console.log(existedUser);
        for (const day of existedUser) {
            const momentObj = moment(day?.startDate).subtract(7, "hours");;
            // Lấy tên ngày tiếng Anh bằng cách sử dụng hàm format
            const nameDay = momentObj.format("dddd");
            if (nameDay === 'Monday') {
                arrangeSeven.Monday.push(day);
            }
            else if (nameDay === 'Tuesday') {
                arrangeSeven.Tuesday.push(day);
            }
            else if (nameDay === 'Wednesday') {
                arrangeSeven.Wednesday.push(day);
            }
            else if (nameDay === 'Thursday') {
                arrangeSeven.Thursday.push(day);
            }
            else if (nameDay === 'Friday') {
                arrangeSeven.Friday.push(day);
            }
            else if (nameDay === 'Saturday') {
                arrangeSeven.Saturday.push(day);
            }
            else if (nameDay === 'Sunday') {
                arrangeSeven.Sunday.push(day);
            }
        }
        existedUser = arrangeSeven;
    }
    if (!weeks) {
        // Tính tổng số lượng dữ liệu sau khi lọc
        const { ObjectId } = Types;
        total = existedUser.length;
        if (sortBeside) {
            existedUser.sort((a, b) => {
                const classIdA = a?.facilityId?.toString();
                const classIdB = b?.facilityId?.toString();

                // Sort by classId first
                if (classIdA !== classIdB) {
                    return classIdA?.localeCompare(classIdB);
                } else {
                    // If classIds are the same, sort by slot
                    return a?.slot?.localeCompare(b.slot);
                }
            });
        }

        // Áp dụng phân trang
        existedUser = existedUser.slice(startIndex, startIndex + size);
    }

    return {
        booking: existedUser, totalPage: Math.ceil(total / size),
        activePage: page
    };

}
/*
- lấy mảng 7 ngày; ở mỗi ngày sẽ có mảng 9 slot,  
*/
const StatusBooking = async (req) => {
    const userProjecttion = {
        createdAt: 0,
        updatedAt: 0,
        id: 0
    }
    const { id } = req.params;
    let { weeks } = req.query
    let query = {};
    if (weeks) {
        query = { weeks: { $regex: weeks, $options: 'i' } }
    }
    let today = new Date();
    // console.log(id);
    today.setHours(0, 0, 0, 0);
    let oneWeekFromToday = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
    oneWeekFromToday.setHours(0, 0, 0, 0)
    let arrangeSeven = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
    }
    const sevenDay = await Booking.find({ $and: [{ startDate: { $gte: today, $lte: oneWeekFromToday } }, query, { facilityId: id }] })
        .populate({ path: 'booker', select: userProjecttion, populate: { path: 'roleId', select: userProjecttion } })
        .populate({ path: 'facilityId', select: userProjecttion })
        .populate({ path: 'handler', select: userProjecttion, populate: { path: 'roleId', select: userProjecttion } }).exec();
    for (const day of sevenDay) {
        // let nameDay = day?.startDate?.toLocaleDateString("en-US", { weekday: "long" });
        // let day = day.toObject();
        const momentObj = moment(day?.startDate).subtract(7, "hours");;
        // Lấy tên ngày tiếng Anh bằng cách sử dụng hàm format
        const nameDay = momentObj.format("dddd");

        if (nameDay === 'Monday') {
            arrangeSeven.Monday.push(day);
        }
        else if (nameDay === 'Tuesday') {
            arrangeSeven.Tuesday.push(day);
        }
        else if (nameDay === 'Wednesday') {
            arrangeSeven.Wednesday.push(day);
        }
        else if (nameDay === 'Thursday') {
            arrangeSeven.Thursday.push(day);
        }
        else if (nameDay === 'Friday') {
            arrangeSeven.Friday.push(day);
        }
        else if (nameDay === 'Saturday') {
            arrangeSeven.Saturday.push(day);
        }
        else if (nameDay === 'Sunday') {
            arrangeSeven.Sunday.push(day);
        }

    }
    // console.log(arrangeSeven);
    return arrangeSeven;
}
const FindBooking = async (req) => {
    const userProjecttion = {
        createdAt: 0,
        updatedAt: 0,
        id: 0
    }
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 5;
    // const { weeks } = req.query
    const startIndex = (page - 1) * size;
    const existedUser = await Booking.findById(id).populate({ path: 'booker', select: userProjecttion }).populate({ path: 'facilityId', select: userProjecttion }).populate({ path: 'handler', select: userProjecttion }).exec();
    return existedUser;
}
const FindBoookingUser = async (req) => {
    const userProjecttion = {
        createdAt: 0,
        updatedAt: 0,
        id: 0
    }
    const { ObjectId } = Types;
    const { id } = req.params;
    const { name, weeks, facilityId } = req.query;
    let query = {};
    if (weeks) {
        query = { weeks: { $regex: weeks, $options: 'i' }, status: { $in: [1, 2, 3] } }
    }
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 5;
    console.log(query);
    const startIndex = (page - 1) * size;
    const existedUser = await Booking.find(query).sort({ createdAt: -1 }).populate([{ path: 'booker' }, { path: 'facilityId', select: userProjecttion }, { path: 'handler', select: userProjecttion }]).exec();
    let arrUser = [];
    for (const item of existedUser) {
        if (facilityId) {
            if (item.booker?._id.equals(new ObjectId(id)) && item.facilityId?._id.equals(new ObjectId(facilityId))) {
                arrUser.push(item)
            }
        } else {
            if (item.booker?._id.equals(new ObjectId(id))) {
                arrUser.push(item)
            }
        }
    }
    if (name) {
        const searchName = name.toLowerCase();
        arrUser = arrUser.filter(e => e?.facilityId && e?.facilityId.name.toLowerCase().includes(searchName));
    }
    let arrangeSeven = [];
    if (weeks) {
        arrangeSeven = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: [],
        }
        // Chuyển đổi các đối tượng Mongoose thành đối tượng JavaScript thuần túy
        // console.log(existedUser);
        for (const day of arrUser) {
            const momentObj = moment(day?.startDate).subtract(7, "hours");;
            // Lấy tên ngày tiếng Anh bằng cách sử dụng hàm format
            const nameDay = momentObj.format("dddd");
            if (nameDay === 'Monday') {
                arrangeSeven.Monday.push(day);
            }
            else if (nameDay === 'Tuesday') {
                arrangeSeven.Tuesday.push(day);
            }
            else if (nameDay === 'Wednesday') {
                arrangeSeven.Wednesday.push(day);
            }
            else if (nameDay === 'Thursday') {
                arrangeSeven.Thursday.push(day);
            }
            else if (nameDay === 'Friday') {
                arrangeSeven.Friday.push(day);
            }
            else if (nameDay === 'Saturday') {
                arrangeSeven.Saturday.push(day);
            }
            else if (nameDay === 'Sunday') {
                arrangeSeven.Sunday.push(day);
            }
        }
        arrUser = arrangeSeven;
    }
    let total = arrUser.length;
    if (!weeks) {
        // Phân trang
        arrUser = arrUser.slice(startIndex, startIndex + size);
    }

    return {
        booking: arrUser, totalPage: Math.ceil(total / size),
        activePage: page
    };
}
const checkUnused = (startDateBooking) => {
    startDateBooking = new Date(startDateBooking);
    const currentTime = new Date();
    const isStartDateLater = startDateBooking > currentTime;
    return isStartDateLater;
}
const UpdateOne = async (req) => {
    let booking = await FindBooking(req);
    if (!booking) {
        return null;
    }
    const { id } = req.params;
    const userId = req.userID;
    req.body.handler = userId;

    const currentMoment = moment(); // Lấy thời điểm hiện tại
    const momentMinus7Hours = currentMoment.add(7, 'hours'); // Trừ đi 7 giờ từ thời điểm hiện tại

    if (req.body.status === 2) {
        const { startDate } = req.body;
        req.body.timeAccept = momentMinus7Hours;
        // kiểm tra cái ô này trước
        req.body.status = checkUnused(startDate) ? 5 : 2;
        // cập nhật những booking khác là 3 
        const { facilityId, slot } = req.body
        await Booking.updateMany(
            { facilityId: facilityId, slot: slot, startDate: booking.startDate, _id: { $ne: id } },
            { $set: { status: 3 } }
        );    }
    else if (req.body.status === 3) {
        req.body.timeReject = momentMinus7Hours;
    }
    const existedUser = await Booking.findByIdAndUpdate(id, req.body, { new: true }).exec();

// ✅ Dựa vào status thực tế trong DB sau khi cập nhật
    const message =
        existedUser.status === 2 || existedUser.status === 5
            ? "Yêu cầu của bạn đã được phê duyệt"
            : "Yêu cầu của bạn đã bị từ chối";

    const user = await User.findById(existedUser.booker);

    const notification = {
        userId: existedUser.booker,
        content: message,
        path: "/historyBooking",
        name: user.name,
    };

    await notificationService.createNotification(notification);
    return existedUser;
}
const DeleteOne = async (req) => {
    let booking = await FindBooking(req);
    if (!booking) {
        return null;
    }
    const { id } = req.params;
    const existedUser = await Booking.deleteOne({ _id: id }).exec();
    return existedUser;
}
const CreateOne = async (req) => {
    const { booker, facilityId, weeks, weekdays, slot, status, startDate, endDate } = req.body;

    const checkSameBooking = await checkBooking({
        booker: booker,
        facilityId: facilityId,
        weeks: weeks,
        weekdays: weekdays,
        slot: slot,
        status: status
    });
    let dateSlot = {};
    let startDate2 = '';
    let endDate2 = '';
    if (checkSameBooking === 'found') {
        return checkSameBooking;
    }
    if (slot == 'Slot1') {
        startDate2 = STARTDATE_SLOT1;
        endDate2 = ENDDATE_SLOT1;
    }
    else if (slot == 'Slot2') {
        startDate2 = STARTDATE_SLOT2;
        endDate2 = ENDDATE_SLOT2;
    }
    else if (slot == 'Slot3') {
        startDate2 = STARTDATE_SLOT3;
        endDate2 = ENDDATE_SLOT3;
    }
    else if (slot == 'Slot4') {
        startDate2 = STARTDATE_SLOT4;
        endDate2 = ENDDATE_SLOT4;
    }
    else if (slot == 'Slot5') {
        startDate2 = STARTDATE_SLOT5;
        endDate2 = ENDDATE_SLOT5;
    }
    else if (slot == 'Slot6') {
        startDate2 = STARTDATE_SLOT6;
        endDate2 = ENDDATE_SLOT6;
    }
    else if (slot == 'Slot7') {
        startDate2 = STARTDATE_SLOT7;
        endDate2 = ENDDATE_SLOT7;
    }
    else if (slot == 'Slot8') {
        startDate2 = STARTDATE_SLOT8;
        endDate2 = ENDDATE_SLOT8;
    }
    else if (slot == 'Slot9') {
        startDate2 = STARTDATE_SLOT9;
        endDate2 = ENDDATE_SLOT9;
    }
    const startTimeString = startDate + startDate2;
    const endTimeString = endDate + endDate2;
    let start = new Date(startTimeString);
    let end = new Date(endTimeString);
    dateSlot = {
        startDate: start,
        endDate: end
    }

    const existedUser = await Booking.create({ ...req.body, ...dateSlot, reportStatus: req.body.reportStatus ?? 0 });
    const user = await User.findById(booker);
    const facility = await Facility.findById(facilityId);
    const notification = {
        content: `${user.name} đã đặt phòng: ${facility.name}`,
        path: '/dashboard',
        name: user.name
    }
    await notificationService.sendNotificationToAdmin(notification);
    return existedUser;
}
/*
    Tên hàm: dashboard theo năm, hoặc theo tháng của booking
        Tham số: Year hoặc month 
*/
const Dashboard = async (req) => {
    // arrange
    // check xem năm trước xem có không hoặc check tháng xem có không
    const { year, status } = req.query;
    // check năm trước
    // nếu có năm thì mk sẽ lấy thông tin của booking; với year bằng với year truyền tới
    const targetYear = year;
    let yearTarget = parseInt(targetYear) + 1;
    let dateTarget = `${parseInt(targetYear) + 1}-01-01T00:00:00.000Z`;
    let query = {
        "createdAt": {
            '$gte': new Date(`2012-01-01T00:00:00.000Z`),
            '$lt': new Date(dateTarget)
        }
    };
    if (status) {
        query = { ...query, status: status };
    }
    let books = await Booking.find(query).exec();

    // sau đó tạo mảng chứa 12 tháng
    let bookingYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (const book of books) {
        var dateObject = new Date(book?.createdAt);

        // Lấy tháng từ đối tượng Date
        var month = dateObject.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0, nên cần cộng thêm 1
        switch (month) {
            case 1:
                bookingYear[0]++;
                break;
            case 2:
                bookingYear[1]++;
                break;
            case 3:
                bookingYear[2]++;
                break;
            case 4:
                bookingYear[3]++;
                break;
            case 5:
                bookingYear[4]++;
                break;
            case 6:
                bookingYear[5]++;
                break;
            case 7:
                bookingYear[6]++;
                break;
            case 8:
                bookingYear[7]++;
                break;
            case 9:
                bookingYear[8]++;
                break;
            case 10:
                bookingYear[9]++;
                break;
            case 11:
                bookingYear[10]++;
                break;
            case 12:
                bookingYear[11]++;
                break;
            default:
                console.log("Invalid month");
        }
    }
    // gán từng tháng theo status của năm 
    return bookingYear;
}

const DashboardWeek = async (req) => {
    // arrange
    // check xem năm trước xem có không hoặc check tháng xem có không
    const { startDate, endDate, status } = req.query;

    let query = {
        "createdAt": {
            '$gte': new Date(startDate),
            '$lt': new Date(endDate)
        }
    };
    if (status) {
        query = { ...query, status: status };
    }
    console.log(query);
    // Truy vấn MongoDB
    let books = await Booking.find(query).exec();

    // sau đó tạo mảng chứa 77 ngày
    let bookingYear = [0, 0, 0, 0, 0, 0, 0];
    for (const day of books) {
        // Chuyển đổi chuỗi sang đối tượng Date
        // Chuyển đổi chuỗi sang đối tượng Moment
        const momentObj = moment(day?.createdAt).subtract(7, "hours");;
        // Lấy tên ngày tiếng Anh bằng cách sử dụng hàm format
        const nameDay = momentObj.format("dddd");
        if (nameDay === 'Monday') {
            bookingYear[0]++;
        }
        else if (nameDay === 'Tuesday') {
            bookingYear[1]++;
        }
        else if (nameDay === 'Wednesday') {
            bookingYear[2]++;
        }
        else if (nameDay === 'Thursday') {
            bookingYear[3]++;
        }
        else if (nameDay === 'Friday') {
            bookingYear[4]++;
        }
        else if (nameDay === 'Saturday') {
            bookingYear[5]++;
        }
        else if (nameDay === 'Sunday') {
            bookingYear[6]++;
        }
        // Lấy tháng từ đối tượng Date
    }
    // gán từng tháng theo status của năm 
    return bookingYear;
}

async function checkBooking(query) {
    try {
        const booking = await Booking.findOne(query);
        if (booking) {
            return "found";
        }
    } catch (error) {
        console.error("Error checking booking:", error);
    }
}

export default {
    FindAll, FindBooking, UpdateOne, DeleteOne, CreateOne, StatusBooking, FindBoookingUser, Dashboard, DashboardWeek
}






