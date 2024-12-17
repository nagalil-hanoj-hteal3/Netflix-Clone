# Trailo-Hub 
<p>This Trailo-Hub streaming website enables users to browse movies, TV shows, collections, and actors with a fully responsive interface from laptop, phone, etc. This project demonstrates a full-stack development process using the MERN stack (MongoDB, Express, React, Node.js) and integrates advanced features and optimizations.</p>
<p>Link to try the website: Click <a href="https://trailohub.onrender.com/" target="_blank">Here</a>!</p>
<a href="https://www.youtube.com/watch?v=Zp8TEOR2sHQ" target="_blank">Click here to watch the demo!</a>

<h1>📚 Project Overview</h1>
<p>This project is inspired by a tutorial by <a href="https://www.youtube.com/@asaprogrammer_">As A Programmer</a>, and includes several custom enhancements beyond the tutorial content. The core functionalities include comprehensive content browsing, user authentication, responsive UI, and rich media metadata such as cast members, reviews, and personalized recommendations.</p>

<h1>⚛️ Tech Stack</h1>
<ul>
  <li><b>Frontend:</b> React.js, Tailwind CSS</li>
  <li><b>Backend:</b> Node.js, Express.js, MongoDB</li>
  <li><b>Authentication:</b> JSON Web Tokens (JWT)</li>
  <li><b>External APIs:</b> The Movie Database (TMDB)</li>
  <li><b>Deployment:</b> Render</li>
</ul>

<h1>🚀 Features</h1>
<ul>
  <li><b>Authentication:</b> Secure JWT-based login and registration.</li>
  <li><b>Responsive Design:</b> Fully responsive UI for all device sizes.</li>
  <li><b>Content Browsing:</b></li>
    <ol>
      <li>Fetch movies and TV shows with advanced filtering options.</li>
      <li>Comprehensive search for movies, TV shows, actors, and collections.</li>
      <li>Watch trailers within the app.</li>
    </ol>
  <li><b>Enhanced Search and Discovery:</b></li>
    <ol>
      <li>Advanced search filters including release year, rating, and genre for movies/TV shows.</li>
      <li>Collections browsing for themed content (e.g., Star Wars collections).</li>
      <li>Dedicated pages for persons, trending content, and popular actors.</li>
    </ol>
  <li><b>User Interaction and Personalization:</b></li>
    <ol>
      <li>Bookmarking feature to save favorite movies and TV shows.</li>
      <li>Bookmarks page for easy access to saved content.</li>
      <li>Recommended content based on user selections.</li>
    </ol>
  <li><b>Movie and TV Show Details:</b></li>
    <ol>
      <li>Comprehensive cast members and roles for each title.</li>
      <li>Image galleries for movies and TV shows.</li>
      <li>TV show season ratings (without episode details).</li>
      <li>User reviews pulled directly from the TMDB database.</li>
      <li>Recommendations for similar movies and TV shows.</li>
    </ol>
  <li><b>Actor and Person Pages:</b></li>
    <ol>
      <li>Detailed actor pages with filmography.</li>
      <li>Photo galleries for actors.</li>
      <li>External links and additional actor information.</li>
      <li>Trending persons page with day/week filtering.</li>
    </ol>
  <li><b>Watch Page Enhancements:</b></li>
    <ol>
      <li>Thumbnail video selections similar to YouTube.</li>
      <li>Easy video switching with thumbnails.</li>
    </ol>
  <li><b>Search History:</b></li>
    <ol>
      <li>Enhanced search history tracking.</li>
      <li>Includes collections in search history.</li>
      <li>Filtering options for search history.</li>
    </ol>
  <li><b>Landing Page:</b> An attractive landing page to welcome users.</li>
  <li><b>Loading Pages:</b> Interactive loading pages used with framer-motion to add creativity.</li>
</ul>

## 🔧 Setup and Configuration
1. Clone the repo:  
   ```bash
   git clone https://github.com/your-username/trailo-hub.git
2. Install dependencies:
    ```bash
   npm install
   npm install --prefix frontend
3. Setup .env file:
    ```bash
    PORT = your port number
    MONGO_URI = your mongo uri
    NODE_ENV = your env
    JWT_SECRET = your jwt secret
    TMDB_API_KEY = your the movie database api key
4. Run the application:
    ```shell
    npm run build
    npm run start
## 🛠 Additional Customizations
<p>This project includes custom features that go beyond the original tutorial:</p>
<ol>
  <li><b>Strategy Design Pattern:</b> Differentiates movies and TV shows based on API response to ensure correct categorization.</li>
  <li><b>Detailed Reviews:</b> Pulls and displays user critiques for movies and shows from the TMDB database.</li>
  <li><b>Comprehensive User Experience:</b> Added bookmarking, collections, and personalized recommendations.</li>
  <li><b>Expanded Search and Discovery:</b> Implemented advanced filtering, collections browsing, and dedicated person pages.</li>
  <li><b>Multi-dimensional Content Exploration:</b> Enhanced pages for movies, TV shows, actors, and trending content.</li>
</ol>

## 💻 Local Development
<p>Open TWO terminals...</p>
<p>To start the development server, run this on the root: </p>

```bash
npm run dev
```
<p>To run the frontend react, run this on the shell: </p>

```bash
cd ./frontend
npm run dev
```
## 🌐 Deployment
<p>This project is hosted on Render (as provided on the link), making it sufficient and easy to deploy both frontend and backend. Simply connect with a repository, set environment variables in Render's dashboard and deploy. Any changes pushed in the repository will automatically redeploy the web service for FREE!</p>

## 📈 Benefits
<ul>
  <li><b>Comprehensive Feature Set:</b> The app includes a variety of functionalities, such as advanced search filters, cast details, bookmarking, and actor information, offering users a more complete content browsing experience.</li>
  <li><b>Responsive and User-Friendly Design:</b> Tailwind CSS provides a sleek, mobile-friendly interface that looks good on all devices.</li>
  <li><b>Efficient State Management:</b> With the strategy design pattern, the app distinguishes between movies and TV shows more efficiently, leading to more organized code and better separation of concerns.</li>
  <li><b>Rich Movie and TV Show Data:</b> Integration with TMDB allows users to view detailed movie and TV show information, including reviews, cast members, and image galleries.</li>
  <li><b>Advanced Search and Discovery:</b> Collections browsing, trending pages, and comprehensive search filters help users explore content more effectively.</li>
  <li><b>Personalization Features:</b> Bookmarking and recommended content based on user selections enhance user engagement.</li>
  <li><b>Secure Authentication:</b> JWT-based authentication ensures secure login sessions, keeping user data private.</li>
  <li><b>Extendable Architecture:</b> The use of patterns and modular code makes it easy to add new features or adapt the codebase to other APIs or functionality in the future.</li>
</ul>

## 📉 Drawbacks
<ul>
  <li><b>Limited Scalability with TMDB API:</b> Reliance on the TMDB API means the app is constrained by TMDB's rate limits and data availability. For high-traffic scenarios, this may require additional caching or a move to a custom database.</li>
  <li><b>Limited User Interaction:</b> While bookmarking is added, more advanced user interactions like ratings or comments are not fully supported.</li>
  <li><b>Single-Server Dependency:</b> The app is hosted on Render as a single backend and frontend instance. For larger user bases, a microservices architecture with separate backend and frontend deployments might be necessary.</li>
  <li><b>No Offline Mode:</b> The app currently requires an active internet connection, as there is no caching or offline data storage implemented.</li>
</ul>

## 🤝 Support
<p>As always! Subscribe to <a href="https://www.youtube.com/@asaprogrammer_">As A Programmer</a> for his tutorials!</p>
