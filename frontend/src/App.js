import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Landing';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Create from './create';
import BlogDetails from './blogDetails';
import NotFound from './notFound';
import Landing from './pages/Landing';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import Privacy from './pages/Privacy';
import ProtectedRoute from './components/ProtectedRoute';
import UserDashboard from './pages/UserDashboard';
import CompanyLogin from './pages/CompanyLogin';
import CompanyDashboard from './pages/CompanyDashboard';
import JobsListing from './pages/JobsListing';
import JobApply from './pages/JobApply';
import JobDetail from './pages/JobDetail';


function App() {

  


  return (
    // router -> switch -> route -> page
    <Router>
      <div className='App'>
        <Navbar />
        <div className="content">
          <Switch>
            <Route exact path ="/">
                <Landing/>
            </Route>
            <Route exact path ="/company/login">
                <CompanyLogin/>
            </Route>
            <Route exact path ="/user/login">
                <UserLogin/>
            </Route>
            <Route exact path ="/user/signup">
                <UserSignup/>
            </Route>

            <Route path="/user/dashboard">
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            </Route>

             <Route path="/company/dashboard">
              <ProtectedRoute role="company">
                <CompanyDashboard />
              </ProtectedRoute>
            </Route>

             <Route path="/user/jobslisting">
              <ProtectedRoute role="user">
                <JobsListing />
              </ProtectedRoute>
            </Route>

            <Route path="/user/jobapply">
              <ProtectedRoute role="user">
                <JobApply />
              </ProtectedRoute>
            </Route>

            <Route path="/user/jobdetail">
              <ProtectedRoute role="user"> 
                <JobDetail />
               </ProtectedRoute>
            </Route>


   


            <Route exact path ="/blog/:id">
                <BlogDetails/>
            </Route>

            <Route exact path="/privacy">
              <Privacy />
            </Route>
            {/* 404 not found */}
            <Route  path ="*">
                <NotFound/>
            </Route>

          </Switch>
        </div>
        <Footer/>
      </div>
    </Router>
  );


}

export default App;
