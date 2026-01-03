import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import useFetch from "./useFetch";
const BlogDetails = () => {


    const { id } = useParams()
    const { data: blog, error, isPending } = useFetch("http://localhost:8000/blogs/" + id);
    return (
        <div className="blog-details">
            {isPending && <div>Loading...</div>}
            {error && <div> {error}</div>}
            {blog && <article>
                <div>
                    <h2>{blog.title}</h2>
                </div>
                <div>Written by {blog.author}</div>
                <div> {blog.body}</div>
            </article>}
        </div>
    );
}

export default BlogDetails;