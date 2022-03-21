<h1 align="center">
  <br>
  <a href="https://bultravel.bogoapps.site/"><img src="https://res.cloudinary.com/dawb3psft/image/upload/v1647680620/Portfolio/bultravel.png" alt="BulTravel" width="150"></a>
  <br>
  BulTravel
  <br>
</h1>

<h4 align="center">Personal Project - create an API in NodeJS</h4>

<p align="center">
  <a href="https://img.shields.io/badge/Made%20with-NodeJS-brightgreen">
    <img src="https://img.shields.io/badge/Made%20with-NodeJS-brightgreen"
         alt="Gitter">
  </a>
  <a href="https://img.shields.io/badge/Made%20with-JavaScript-yellow"><img src="https://img.shields.io/badge/Made%20with-JavaScript-yellow"></a>
  <a href="https://img.shields.io/tokei/lines/github/Bogo56/TravelApp_NodeJS">
      <img src="https://img.shields.io/tokei/lines/github/Bogo56/TravelApp_NodeJS">
  </a>
  <a href="https://img.shields.io/github/languages/count/Bogo56/TravelApp_NodeJS?color=f">
    <img src="https://img.shields.io/github/languages/count/Bogo56/TravelApp_NodeJS?color=f">
  </a>
  <a href="https://badgen.net/github/commits/Bogo56/TravelApp_NodeJS">
    <img src="https://badgen.net/github/commits/Bogo56/TravelApp_NodeJS">
  </a>
</p>

<p align="center">
  <a href="#about-the-project">About The Project</a> •
  <a href="#check-out-the-project">Check out the Project</a> •
  <a href="#about-the-api">About the API</a> •
  <a href="#project-structure">Project Structure</a> 
</p>

## Built With
###  Languages
<p>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
<p>
  
### Frameworks
<p>
<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white">
<img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge">
</p>

### Databases
<p>
<img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white">
</p>

### Additional Libraries and Technologies
<p>
  <img src="https://img.shields.io/badge/ORM-Mongoose-red?style=for-the-badge">
  <img src="https://img.shields.io/badge/OS-Ubuntu-orange?style=for-the-badge">
  <img src="https://img.shields.io/badge/Templating-EJS-green?style=for-the-badge">
  <img src="https://img.shields.io/badge/API-Stripe-blueviolet?style=for-the-badge">
  <img src="https://img.shields.io/badge/API-MapBox-blueviolet?style=for-the-badge">
  <img src="https://img.shields.io/badge/Security-Bcrypt-green?style=for-the-badge">
  <img src="https://img.shields.io/badge/Security-Helmet-green?style=for-the-badge">
    <img src="https://img.shields.io/badge/Security-JWT-green?style=for-the-badge">
</p>

## About The Project
The main motivation behind this project was to greatly improve my ability in building and working with API's. I have already build a couple of API's in Python(with Flask). 
Since JavaScript(NodeJS) was a relatively new addition in my tech stack, this was a great opportunity to both upgrade my skills in back-end development with Node and 
to enhance my understanding of what a proper API structure is. I really wanted to make this project more authentic, so I decided to do a small website for booking tours in Bulgaria.

The **main focus of this project is the API** - where I have spent about **75%** of my efforts. I also decided to create a simple front-end (vanilla JS, HTML, CSS) that showcases an
example of how the API might be consumed.

Most of the webpages are **rendered server-side - EJS templates**. To improve experience and user notifications I have also included some frontend JS - mainly with form submition and admin menu.

I have **deployed the project on my own Ubuntu 18.04 server**, so you can check it out for yourself. I'm using **PM2 as a process manager** to manage app fails and restarts. You'll find a link below

## Check out the Project
As I mentioned, I have created an example frontend that uses part of the API's functionality. You can check the project at:
https://bultravel.bogoapps.site/

There are different types of user roles[user,guide,admin], which have different permissions.

You can log **as an user** with:
**USERNAME**: "marto@example.com"
**PASSWORD**: "password"
OR create an account yourself(No spam - promise :D)

You can log in **as an admin** (access to the admin menu) with:
**USERNAME**: "admin@admin.com"
**PASSWORD**: "admin"
* I have restricted the update operations to superadmins(myself) intentionally - to keep it simple 😅.

I'm using **Stripe in TEST mode** - so just type **4242 4242 4242 4242** as payment card.

## About the API
### API Reference
I have used POSTMAN for testing and building the API. I also used it to generate a simple documentation, so you can easily check it's structure. This is the link to the documentation:
https://documenter.getpostman.com/view/16479105/UVsQriWC

### Features
* Standart CRUD operations for creating and modifying Tours, Users, Bookings, Reviews
* Filtering on resources - searching, pagination, less than/greater than, exclude/include fields, sort asc/desc, limit number of results etc.
* Priviliges based on user role - lead-guides and admins can modify tours, only admins can modify users, only users can write reviews etc.
* Forget password functionality. Sends a restoration link on email (expires in 10 min) for password reset.
* Payment with Stripe - e.g receiving webhooks from strype on successfull payment.

## Project Structure
* The ogranization of the project files follows the MVC pattern
* I created a custom error class. I use it to controll which errors get passed to the client - I don't want to expose the structure of the code to unfriendly outside users by showing some errors not directly connected ot the request, that give unnecessary info about the backend structure.

```
📦 TravelApp_NodeJS
.gitignore
.prettierrc
README.md
package-lock.json
package.json
app.js
server.js
├─ controller
|  ├─ authController.js
|  ├─ bookingController.js
|  ├─ handlerFactories.js
|  ├─ reviewController.js
|  ├─ tourController.js
|  ├─ userController.js
│  ├─ viewAuthController.js
│  └─ viewController.js
├─ errorHandlers
|  ├─ catchAsync.js
│  ├─ globalErrHandler.js
│  └─ viewErrHandler.js
├─ errors
│  └─ customErrors.js
├─ model
|  ├─ bookingModel.js
|  ├─ reviewModel.js
│  ├─ tourModel.js
│  └─ userModel.js
├─ public
│  ├─ css
│  │  └─ style.css
│  ├─ img
│  └─ js
│     ├─ authenticate.js
|     ├─ booking.js
|     ├─ map.js
|     ├─ notifications.js
|     ├─ resetPass.js
|     ├─ signup.js
|     ├─ stripeAlert.js
|     ├─ templates.js
│     ├─ updateDocument.js
│     └─ updateUser.js
├─ routes
│  ├─ bookingRoutes.js
|  ├─ reviewRoutes.js
|  ├─ tourRoutes.js
|  ├─ userRoutes.js
│  ├─ viewRoutes.js
│  └─ webHooksRoutes.js
├─ seed
│  ├─ prepareData.js
|  ├─ seed.js
│  ├─ seed_files
│  |  ├─ bg_destinations.json
|  |  ├─ bg_destinations_final.json
|  |  ├─ finalTourRoutes.json
│  │  ├─ tourRoutes.json
│  │  └─ users.json
│  └─ seed_helpers.js
├─ utils
│  ├─ apiEnhancements.js
|  ├─ cryptoUtils.js
|  ├─ emails.js
│  ├─ imgTools.js
│  └─ reqUtils.js
└─ views
   ├─ bookings.ejs
   ├─ editMe.ejs
   ├─ error.ejs
   ├─ forgetPass.ejs
   ├─ layout
   │  ├─ account.ejs
   │  └─ boilerplate.ejs
   ├─ login.ejs
   ├─ manageUsers.ejs
   ├─ overview.ejs
   ├─ partials
   │  ├─ _footer.ejs
   │  ├─ _header.ejs
   │  └─ _userMenu.ejs
   ├─ resetPass.ejs
   ├─ signup.ejs
   ├─ tour.ejs
   └─ updateTour.ejs
```
©generated by [Project Tree Generator](https://woochanleee.github.io/project-tree-generator)

