import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';

const verifyToken = async (req, res, next) => {
	let token = req.headers.authorization
	if (!token) {
		return res.status(403).send({ message: "No token provide!" });
	}
	token = token.split('Bearer ')[1];
	const jwtSecret = process.env.JWT_SECRET;
	jwt.verify(token,
		jwtSecret,
		(error, decoded) => {
			if (error) {
				return res.status(403).send({
					message: error
				})
			}
			req.userID = decoded.id;
			next();
		})
}

function checkRole(roleInput) {
	const roleNames = Array.isArray(roleInput) ? roleInput : [roleInput];

	return async function (req, res, next) {
		try {
			const user = await User.findById(req.userID).exec();
			if (!user) {
				return res.status(400).send({ message: "User not found!" });
			}

			const userRole = await Role.findById(user.roleId).exec();
			if (!userRole) {
				return res.status(400).send({ message: "User Role not found" });
			}

			if (roleNames.includes(userRole.roleName)) {
				next();
			} else {
				return res.status(403).send({ message: `Require one of roles: ${roleNames.join(", ")}` });
			}
		} catch (error) {
			return res.status(500).send({ message: error.message });
		}
	};
}



export default {
	verifyToken,
	checkRole
}