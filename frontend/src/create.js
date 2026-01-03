import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Create = () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [author, setAuthor] = useState("");
    const [isPending, setIsPending] = useState(false);
    const history = useHistory();


    const handleSubmit = (e) => {
        e.preventDefault();
        const blog = { title, author, body };
        console.log(blog);

        setIsPending(true);


        fetch("http://localhost:8000/blogs", {

            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blog)
        }).then(() => {
            console.log('new blog added');
            setIsPending(false)
        }).catch((err) => console.log(err.message));

        // history.go(-1);
        history.push("/");
    }
 

    return (
        <div className="create">
            <h2>Add a new blog</h2>
            <form onSubmit={handleSubmit}>
                {/* title */}
                <label htmlFor="title">
                    Title:
                </label>
                <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                {/* author */}
                <label htmlFor="author">
                    Author:
                </label>
                <select name="author" value={author} onChange={(e) => setAuthor(e.target.value)} required>
                    <option value="" hidden>option</option>
                    <option value="mario">mario</option>
                    <option value="yoshi">yoshi</option>
                </select>
                {/* body */}
                <label htmlFor="body">
                    Body :
                </label>
                <textarea type="text" rows={5} name="body" value={body} onChange={(e) => setBody(e.target.value)} required />
                {!isPending && <button>Add Blog</button>}
                {isPending && <button disabled>Adding Blog...</button>}
            </form>
        </div>
    );
}

export default Create;