from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

def create_perfect_resume():
    c = canvas.Canvas("test_resume_perfect.pdf", pagesize=letter)
    width, height = letter

    # 1. Name & Role
    c.setFont("Helvetica-Bold", 20)
    c.drawString(50, height - 50, "John Doe")
    c.setFont("Helvetica", 14)
    c.drawString(50, height - 75, "Senior Software Engineer")

    # 2. Separator Line
    c.line(50, height - 85, 550, height - 85)

    # 3. Education Section
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, height - 120, "EDUCATION")
    
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 140, "B.Tech in Computer Science")
    c.drawString(50, height - 155, "University of Technology, India (2019 - 2023)")

    # 4. Experience Section
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, height - 200, "EXPERIENCE")
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 220, "Full Stack Developer | Tech Solutions Inc.")
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 235, "June 2023 - Present")
    c.drawString(60, height - 250, "- Developed scalable APIs using Python Flask and PostgreSQL.")
    c.drawString(60, height - 265, "- Built responsive frontends using React.js and Tailwind CSS.")

    # 5. Skills Section
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, height - 310, "SKILLS")
    
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 330, "Languages: Python, JavaScript, SQL")
    c.drawString(50, height - 345, "Frameworks: Flask, React, Node.js")
    c.drawString(50, height - 360, "Tools: Docker, Git, AWS")

    c.save()
    print("✅ Created 'test_resume_perfect.pdf' successfully!")

if __name__ == "__main__":
    create_perfect_resume()