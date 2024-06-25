import jwt from 'jsonwebtoken'

const fetchuser = (req, res, next) => {
	const farmer_token = req.cookies.farmer_token;

	if (!req.cookies.farmer_token) {
		return res.status(403).json({message: "Unauthorized user - No token provided."});
	}

	try {
		const data = jwt.verify(farmer_token, process.env.JWT_SECRET);
		const {username, userId, phoneNumber, email, type, description, location} = data;

		req.username = username;
		req.email = email;
        req.userId = userId;
        req.phoneNumber = phoneNumber;
		req.type = type
		req.description = description
		req.location = location

        // console.log(data)
	} catch (error) {
		return res.status(403).json({message: "Unauthorized user - No token provided."});
	}
	next();
};

export default fetchuser;
