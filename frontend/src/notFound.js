import { Link, useHistory } from "react-router-dom";

const NotFound = () => {
    const history = useHistory();
    
    return ( 
        <div className="not-found">
            <section className="dashboard">
                <div className="container-small">
                    <div className="empty-state" style={{ padding: "4rem 1rem" }}>
                        <div style={{ fontSize: "6rem", marginBottom: "1rem" }}>404</div>
                        <h1 className="empty-state-title" style={{ fontSize: "2rem" }}>Page Not Found</h1>
                        <p className="empty-state-text" style={{ fontSize: "1.125rem" }}>
                            The page you're looking for doesn't exist or has been moved.
                        </p>
                        <div className="flex gap-2 justify-center" style={{ marginTop: "2rem" }}>
                            <Link to="/" className="btn btn-primary btn-large">Go to Home</Link>
                            <button onClick={() => history.go(-1)} className="btn btn-outline btn-large">Go Back</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
     )
}
 
export default NotFound
