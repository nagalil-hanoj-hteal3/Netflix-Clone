# Netflix Clone 
<p>This Netflix-inspired streaming website enables users to browse movies, TV shows, and actors with a fully responsive interface from laptop, phone, etc. This project demonstrates a full-stack development process using the MERN stack (MongoDB, Express, React, Node.js) and integrates additional advanced features and optimizations.</p>
<p>Link to try the website: <a>https://netflix-clone-yq9d.onrender.com/</a></p>

<h1>📚 Project Overview</h1>
<p>This project is inspired by a tutorial by <a href="https://www.youtube.com/@asaprogrammer_">As A Programmer</a>, and includes several custom enhancements beyond the tutorial content. The core functionalities include browsing and searching content, user authentication, responsive UI, and movie/TV show metadata such as cast members, reviews, and similar content recommendations.</p>

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
      <li>Fetch movies and TV shows with filtering options.</li>
      <li>Search for movies, TV shows, and actors.</li>
      <li>Watch trailers within the app.</li>
    </ol>
  <li><b>Enhanced Search and History:</b></li>
    <ol>
      <li>Search filters within search history: by category, name order, and date order.</li>
      <li>Dedicated actor pages with detailed actor information.</li>
    </ol>
  <li><b>Movie and TV Show Details:</b></li>
    <ol>
      <li>Cast members and roles for each title.</li>
      <li>User reviews pulled directly from the TMDB database.</li>
      <li>Recommendations for similar movies and TV shows.</li>
    </ol>
  <li><b>Landing Page:</b> An attractive landing page to welcome users.</li>
</ul>

## 🔧 Setup and Configuration
1. Clone the repo:  
   ```bash
   git clone https://github.com/your-username/netflix-clone.git
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
  <li><b>Actor Page:</b> Dedicated page with detailed information for each actor, accessible from the search results.</li>
  <li><b>Advanced Search Filters:</b> Search history is filterable by category, name, and search date in both ascending and descending order.</li>
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
  <li><b>Comprehensive Feature Set:</b> The app includes a variety of functionalities, such as search filters, cast details, and actor information, offering users a more complete experience than basic content browsers.</li>
  <li><b>Responsive and User-Friendly Design:</b> Tailwind CSS provides a sleek, mobile-friendly interface that looks good on all devices.</li>
  <li><b>Efficient State Management:</b> With the strategy design pattern, the app distinguishes between movies and TV shows more efficiently, leading to more organized code and better separation of concerns.</li>
  <li><b>Rich Movie and TV Show Data:</b> Integration with TMDB allows users to view not only movie and TV show details but also related reviews and cast members, adding depth to the browsing experience.</li>
  <li><b>Search History Filtering:</b> Advanced filtering by category, name, and date helps users keep track of past searches and rediscover previously viewed content with ease.</li>
  <li><b>Secure Authentication:</b> JWT-based authentication ensures secure login sessions, keeping user data private.</li>
  <li><b>Extendable Architecture:</b> The use of patterns and modular code makes it easy to add new features or adapt the codebase to other APIs or functionality in the future.</li>
</ul>

## 📉 Drawbacks
<ul>
  <li><b>Limited Scalability with TMDB API:</b> Reliance on the TMDB API means the app is constrained by TMDB’s rate limits and data availability. For high-traffic scenarios, this may require additional caching or a move to a custom database.</li>
  <li><b>Basic User Interaction:</b> User interactions, such as ratings or comments, are not supported, which could limit user engagement compared to real streaming platforms.</li>
  <li><b>Single-Server Dependency:</b> The app is hosted on Render as a single backend and frontend instance. For larger user bases, a microservices architecture with separate backend and frontend deployments might be necessary.</li>
  <li><b>No Offline Mode:</b> The app currently requires an active internet connection, as there is no caching or offline data storage implemented.</li>
</ul>

## 🤝 Support
<p>As always! Subscribe to <a href="https://www.youtube.com/@asaprogrammer_">As A Programmer</a> for his tutorials!</p>
