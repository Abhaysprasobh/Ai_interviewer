import { Link } from 'react-router-dom';

const Privacy = () => {
    return ( 
        <div className="privacy">
            <section className="dashboard">
                <div className="container-narrow">
                    <h1 className="dashboard-title">Privacy Policy</h1>
                    <p className="text-muted mb-4">Last updated: December 2024</p>

                    <div className="card">
                        <div className="card-body">
                            <h2 style={{marginTop: 0}}>Introduction</h2>
                            <p>
                                Welcome to AI Hiring Platform ("we," "our," or "us"). We are committed to protecting your personal
                                information and your right to privacy. This Privacy Policy explains how we collect, use, disclose,
                                and safeguard your information when you use our platform.
                            </p>

                            <h2>Information We Collect</h2>
                            <h3>Personal Information</h3>
                            <p>When you register on our platform, we collect:</p>
                            <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}}>
                                <li>Full name and contact information (email, phone number, WhatsApp)</li>
                                <li>Professional information (resumes, work experience, education)</li>
                                <li>Account credentials (encrypted passwords)</li>
                                <li>Company information (for employer accounts)</li>
                            </ul>

                            <h3>Interview Data</h3>
                            <p>During AI-powered interviews, we collect:</p>
                            <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}}>
                                <li>Your responses to interview questions (text and voice recordings)</li>
                                <li>Performance metrics and AI-generated assessments</li>
                                <li>Timestamps and completion data</li>
                            </ul>

                            <h3>Automatically Collected Information</h3>
                            <p>We automatically collect certain information when you visit our platform:</p>
                            <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}}>
                                <li>Device information (IP address, browser type, operating system)</li>
                                <li>Usage data (pages visited, time spent, interactions)</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>

                            <h2>How We Use Your Information</h2>
                            <p>We use your information to:</p>
                            <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}}>
                                <li>Provide and maintain our services</li>
                                <li>Process job applications and conduct AI interviews</li>
                                <li>Match candidates with suitable job opportunities</li>
                                <li>Communicate with you about your applications and account</li>
                                <li>Improve our AI algorithms and platform features</li>
                                <li>Ensure platform security and prevent fraud</li>
                                <li>Comply with legal obligations</li>
                            </ul>

                            <h2>AI Processing and Analysis</h2>
                            <p>
                                Our platform uses artificial intelligence to analyze resumes and interview responses.
                                This AI processing helps employers evaluate candidates objectively and efficiently.
                                By using our platform, you consent to this AI-powered analysis of your information.
                            </p>

                            <h2>Information Sharing</h2>
                            <p>We may share your information with:</p>
                            <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}}>
                                <li><strong>Employers:</strong> Your application information, resume, and interview results are shared with employers when you apply for their jobs</li>
                                <li><strong>Service Providers:</strong> Third-party vendors who assist us in operating our platform</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                            </ul>
                            <p>
                                We do not sell your personal information to third parties.
                            </p>

                            <h2>Data Security</h2>
                            <p>
                                We implement appropriate technical and organizational measures to protect your personal information.
                                However, no electronic transmission or storage is 100% secure. While we strive to protect your data,
                                we cannot guarantee absolute security.
                            </p>

                            <h2>Your Rights</h2>
                            <p>Depending on your location, you may have the following rights:</p>
                            <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}}>
                                <li>Access the personal information we hold about you</li>
                                <li>Request correction of inaccurate information</li>
                                <li>Request deletion of your information</li>
                                <li>Object to processing of your information</li>
                                <li>Request data portability</li>
                                <li>Withdraw consent (where processing is based on consent)</li>
                            </ul>

                            <h2>Data Retention</h2>
                            <p>
                                We retain your personal information for as long as necessary to fulfill the purposes outlined in this
                                Privacy Policy, unless a longer retention period is required by law. Job applications and interview
                                data are typically retained for up to 2 years after the application date.
                            </p>

                            <h2>Cookies</h2>
                            <p>
                                We use cookies and similar tracking technologies to enhance your experience on our platform.
                                You can control cookie preferences through your browser settings.
                            </p>

                            <h2>Children's Privacy</h2>
                            <p>
                                Our platform is not intended for individuals under 18 years of age. We do not knowingly collect
                                personal information from children.
                            </p>

                            <h2>Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                                the new policy on this page and updating the "Last updated" date.
                            </p>

                            <h2>Contact Us</h2>
                            <p>
                                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
                            </p>
                            <p>
                                <strong>Email:</strong> privacy@aihiring.com<br />
                                <strong>Address:</strong> [Company Address]
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <Link to="/" className="btn btn-primary">Back to Home</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
 
export default Privacy;
