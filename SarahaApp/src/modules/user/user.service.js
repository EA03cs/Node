
export const getAllUsers = ( (req, res) => {
res.status(200).json({ message: "success", data: [] });
});

export const getUserById = ( (req, res) => {
res.status(200).json({ message: "success", data: null });
});

export const searchUser = ( (req, res) => {
res.status(200).json({ message: "success", data: [] });
});

export const updateUser = ( (req, res) => {
res.status(200).json({ message: "success", data: null });
});

export const deleteUser = ( (req, res) => {
res.status(200).json({ message: "success" });
});
