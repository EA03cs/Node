import connection from "../../DB/connection.db.js";
import { asyncHandler, HttpError } from "../../utils/http.js";

export const createBlog = asyncHandler(async (req, res) => {
    const { title, content, authorId } = req.body;

    if (!title || !content || !authorId) {
        throw new HttpError(400, 'Title, content, and authorId are required');
    }

    const findId = 'SELECT u_id FROM users WHERE u_id = ?';
    const [authors] = await connection.execute(findId, [authorId]);

    if (authors.length === 0) {
        throw new HttpError(404, 'Author not found');
    }

    const sql = 'INSERT INTO blogs (b_title, b_content, b_author_id) VALUES (?, ?, ?)';
    const [data] = await connection.execute(sql, [title, content, authorId]);

    return res.status(201).json({ message: "Blog created successfully", data: { id: data.insertId } });
});

export const getAllBlogs = asyncHandler(async (req, res) => {
    const sql = `
        SELECT
            b_id,
            b_title,
            b_content,
            CONCAT_WS(" ", u_firstname, u_middlename, u_lastname) AS authorName
        FROM blogs
        JOIN users ON b_author_id = u_id
    `;
    const [data] = await connection.execute(sql);

    return res.json({ message: "Done", data });
});
