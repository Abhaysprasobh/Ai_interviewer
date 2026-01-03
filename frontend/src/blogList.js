import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const BlogList = ({ blogs, title }) => {
    // const blogs = props.blogs;
    // const title = props.title;
    const history = useHistory();
    const handleDelete = (id) => {
        fetch("http://localhost:8000/blogs/" + id,
            {
                method: "DELETE",
            
            }
        ).then(() => {
            window.location.reload();
        });
        
    }


    return (
        <div className="blog-list">
            <h2>{title}</h2>
            {blogs.map((blog) => (
                <div className="blog-preview" key={blog.id}>
                    <div className="blog-header">
                        <Link to={`/blog/${blog.id}`}>
                            <h2>{blog.title}</h2>
                        </Link>

                            <span onClick={()=> {handleDelete(blog.id)}}>x</span>
                        </div>
                        <p>Written by: {blog.author}</p>
              
                </div>
            ))}
        
        </div>
    );
}

export default BlogList;