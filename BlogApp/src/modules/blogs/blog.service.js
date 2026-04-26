import connection from "../../DB/connection.db.js";

export const createBlog = (req, res, next) => {
    const { title, content, authorId } = req.body;
    console.log({ title, content, authorId });
    const findId = 'select * from users where u_id=?'
    connection.query(findId, [authorId], (err, data) => {
        if (err) {
            res.status(500).json({ message: "internal server error" })
        } if (data.length === 0) {
            return res.status(404).json({ message: "Author not found" })
        }
    })
    const sql = 'insert into blogs (b_title, b_content, b_author_id) values (?, ?, ?)'
    connection.execute(sql, [title, content, authorId], (err, data) => {
        if (err) {
            res.status(500).json({ message: "internal server error" })
        }
        return res.json({ message: "Blog created successfully", data })
    })
};
export const getAllBlogs = (req, res, next) => {
    const sql = 'select b_id, b_title, b_content, concat(u_firstname, " ", u_middlename, " ", u_lastname) as authorName from blogs join users on b_author_id=u_id'
    connection.query(sql, (err, data) => {
        if (err) {
            res.status(500).json({ message: "internal server error" })
        }
        return res.json({ message: "Done", data })
    })
};
