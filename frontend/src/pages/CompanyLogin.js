const CompanyLogin = () => {
    return ( 
        <section class="py-5">
            <div class="container-small">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Company Login</h2>
                    </div>
                    <div class="card-body">
                        <!-- Error message container -->
                        <div id="errorMessage" class="alert alert-error hidden"></div>

                        <form id="loginForm">
                            <div class="form-group">
                                <label for="email" class="form-label">Company Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    class="form-input"
                                    placeholder="company@example.com"
                                    required
                                >
                            </div>

                            <div class="form-group">
                                <label for="password" class="form-label">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    class="form-input"
                                    placeholder="Enter your password"
                                    required
                                >
                            </div>

                            <button type="submit" class="btn btn-primary btn-block btn-large">
                                Login
                            </button>
                        </form>

                        <div class="divider"></div>

                        <p class="text-center text-muted">
                            Don't have an account?
                            <a href="company-signup.html">Sign up here</a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
 
export default CompanyLogin;