# Energen - Solar Energy Management Platform

Energen is a complete solar energy management platform that combines a public-facing website with a private admin dashboard. It allows businesses to showcase their solar products, publish blog posts, display project case studies, and manage client testimonials – all without any technical help.

## Features

### Public Website
- **Homepage** – Professional landing page with hero section, featured products, and call-to-action
- **Products** – Browse solar products with images, descriptions, and pricing
- **Blogs** – Read articles about solar energy, installation guides, and industry updates
- **Projects** – View completed solar installations with detailed case studies
- **Testimonials** – Read feedback from satisfied clients
- **Contact** – Enquire via WhatsApp or contact form
- **Cart** – Add products to cart and checkout via WhatsApp

### Admin Dashboard
- **Product Management** – Add, edit, and delete products with images and pricing
- **Blog Management** – Write and publish blog posts with images and keywords
- **Project Management** – Upload project case studies with images and details
- **Testimonials Management** – Collect and display client feedback
- **Secure Authentication** – Login with email and password, protected by JWT
- **User Profile** – View and manage your profile

### Technical Features
- **Responsive Design** – Works on desktop, tablet, and mobile
- **SEO Optimized** – Meta tags, keywords, and clean URLs
- **Image Upload** – Upload images for products, blogs, and projects
- **WhatsApp Integration** – Checkout and enquiries via WhatsApp
- **Secure Authentication** – JWT with httpOnly cookies
- **Password Reset** – Reset password via email OTP

## Technologies Used

### Frontend
- **React** – UI library for building the user interface
- **Vite** – Build tool for fast development and production builds
- **React Router** – Client-side routing
- **React Icons** – Icon library for UI components

### Backend
- **Node.js** – JavaScript runtime for the backend
- **Express.js** – Web framework for building APIs
- **JSON Data Storage** – Lightweight data storage using JSON files
- **JWT** – Authentication via JSON Web Tokens
- **bcryptjs** – Password hashing for security
- **Multer** – Image upload handling
- **Cookie Parser** – Parse cookies for authentication

### Deployment
- **Render** – Cloud hosting for frontend and backend

## Data Flow

### Product Management
1. Admin adds product via dashboard
2. Product data is sent to backend
3. Image is saved to `uploads/` folder
4. Product is stored in `inventory.json`
5. Product appears on public website instantly

### Blog Publishing
1. Admin writes blog post via dashboard
2. Blog data is sent to backend
3. Image is saved to `uploads/` folder
4. Blog is stored in `blogs.json`
5. Blog appears on public website instantly

### User Authentication
1. User logs in with email and password
2. Backend validates credentials against `profile.json`
3. JWT token is generated and stored in httpOnly cookie
4. User is redirected to dashboard
5. Subsequent requests are authenticated via cookie

## API Endpoints

### Public Endpoints
- `GET /api/inventory` – Fetch all products
- `GET /api/blogs` – Fetch all blog posts
- `GET /api/projects` – Fetch all projects
- `GET /api/testimonials` – Fetch all testimonials
- `GET /api/health` – Health check

### Protected Endpoints (Requires Authentication)
- `POST /api/inventory` – Add new product
- `PUT /api/inventory/:id` – Update product
- `DELETE /api/inventory/:id` – Delete product
- `POST /api/blogs` – Add new blog
- `PUT /api/blogs/:id` – Update blog
- `DELETE /api/blogs/:id` – Delete blog
- `POST /api/projects` – Add new project
- `PUT /api/projects/:id` – Update project
- `DELETE /api/projects/:id` – Delete project
- `POST /api/testimonials` – Add new testimonial
- `PUT /api/testimonials/:id` – Update testimonial
- `DELETE /api/testimonials/:id` – Delete testimonial

### Authentication Endpoints
- `POST /api/register` – Register new user
- `POST /api/login` – Login user
- `GET /api/profile` – Get user profile
- `POST /api/logout` – Logout user

### Password Reset Endpoints
- `POST /api/reset/send-otp` – Send OTP for password reset
- `POST /api/reset/verify-otp` – Verify OTP
- `POST /api/reset/reset-password` – Reset password

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend

   energen/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── blogController.js
│   │   ├── inventoryController.js
│   │   ├── projectController.js
│   │   └── testimonialsController.js
│   ├── data/
│   │   ├── profile.json
│   │   ├── inventory.json
│   │   ├── blogs.json
│   │   ├── projects.json
│   │   └── testimonials.json
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── routes/
│   │   ├── authRoute.js
│   │   ├── blogRoute.js
│   │   ├── inventoryRoute.js
│   │   ├── projectRoute.js
│   │   └── testimonialsRoute.js
│   ├── utils/
│   │   └── sendEmail.js
│   ├── uploads/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── jsx/
│   │   │   │   │   ├── Dashboard.jsx
│   │   │   │   │   ├── ProductManage.jsx
│   │   │   │   │   ├── BlogManage.jsx
│   │   │   │   │   ├── ProjectManage.jsx
│   │   │   │   │   └── TestimonialsManage.jsx
│   │   │   │   └── css/
│   │   │   └── public/
│   │   │       ├── jsx/
│   │   │       │   ├── Navbar.jsx
│   │   │       │   ├── Footer.jsx
│   │   │       │   ├── Hero.jsx
│   │   │       │   ├── Products.jsx
│   │   │       │   ├── BlogSection.jsx
│   │   │       │   ├── Projects.jsx
│   │   │       │   └── Testimonials.jsx
│   │   │       └── css/
│   │   ├── layouts/
│   │   │   └── PublicLayout.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   └── Contact.jsx
│   │   ├── utils/
│   │   │   └── CartUtil.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── Dockerfile
└── README.md


## How Data Flows in Energen

The Energen platform operates on a simple but powerful data flow model. All data is stored in JSON files on the backend server (backend/data/). When a visitor views the public website, the frontend makes API calls to the backend, which reads the JSON files and returns the data as JSON. The frontend then renders the data into the user interface. For example, when someone visits the Products page, a GET request is sent to /api/inventory, the backend reads inventory.json, and the products are displayed as cards on the page. The same flow applies to blogs, projects, and testimonials. All public content is fetched dynamically, ensuring that any update made through the admin dashboard appears instantly on the live site.

When an admin makes changes through the dashboard, the data flow works in reverse. The admin submits a form, the frontend sends a POST, PUT, or DELETE request to the backend, the backend updates the relevant JSON file, and the frontend refreshes to show the updated data. Images are handled separately through Multer, which saves uploaded files to the uploads/ folder and stores the file paths in the JSON files. Authentication is managed via JWT tokens stored in httpOnly cookies, ensuring that only authorised users can access the admin dashboard. This simple but effective data flow means you have full control over your content without needing any technical knowledge.



## Live Demo & Contact

**🔗 Live Site:** https://energen-6t0a.onrender.com

**📧 Email:** simonmbithi143@gmail.com  
**📱 Phone:** +254703433014

Feel free to explore the platform and get in touch if you have any questions or would like to discuss a project.



   
