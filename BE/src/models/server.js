import app from "./src/app.js";
import roleService from "./src/services/role.service.js";

const PORT = process.env.PORT || 3055

const server = app.listen(PORT, () => {
    console.log('App start with port ' + PORT);
    roleService.initBaseRole()
})
