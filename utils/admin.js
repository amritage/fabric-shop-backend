const bcrypt = require('bcryptjs');
const Admin = require('../model/Admin');
const saltRounds = 10;

const admins = [
  {
    name: 'Dorothy R. Brown',
    image: 'https://i.ibb.co/wpjNftS/user-2.jpg',
    email: 'dorothy@gmail.com',
    password: bcrypt.hashSync('123456', saltRounds),
    phone: '708-628-3122',
    role: 'Admin',
    joiningDate: new Date(),
  },
  {
    name: 'Alice B. Porter',
    image: 'https://i.ibb.co/wpjNftS/user-2.jpg',
    email: 'porter@gmail.com',
    password: bcrypt.hashSync('123456', saltRounds),
    phone: '708-628-3122',
    role: 'Admin',
    joiningDate: new Date(),
  },
  {
    name: 'Corrie H. Cates',
    image: 'https://i.ibb.co/wpjNftS/user-2.jpg',
    email: 'corrie@gmail.com',
    password: bcrypt.hashSync('123456', saltRounds),
    phone: '708-628-3122',
    role: 'Admin',
    joiningDate: new Date(),
  },
  {
    name: 'Shawn E. Palmer',
    image: 'https://i.ibb.co/wpjNftS/user-2.jpg',
    email: 'palmer@gmail.com',
    password: bcrypt.hashSync('123456', saltRounds),
    phone: '902-628-3122',
    role: 'CEO',
    joiningDate: new Date(),
  },
  {
    name: 'Stacey J. Meikle',
    image: 'https://i.ibb.co/wpjNftS/user-2.jpg',
    email: 'meikle@gmail.com',
    password: bcrypt.hashSync('123456', saltRounds),
    phone: '102-628-3122',
    role: 'Manager',
    joiningDate: new Date(),
  },
];

const isAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: No user found' });
  }
  const user = await Admin.findById(req.user._id);
  if (!user || (user.role !== 'Admin' && user.role !== 'SuperAdmin')) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { admins, isAdmin };
