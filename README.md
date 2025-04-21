<p align="center">
  <a href="https://github.com/larilofman/shopping-list">
    <img src="/frontend/public/logo192.png" alt="Logo" width="192">
  </a>

  <h3 align="center">Kauppalappu</h3>

  <p align="center">
    Responsive, easy to use shopping list web application
    <br />
    <a href="https://marimetsola.com/kauppalappu" target="_blank"><strong>Open app »</strong></a>
    <br />
</p>

## Table of Contents

* [About the Project](#about-the-project)
  * [List Of Features](#list-of-features)
  * [Built With](#built-with)
* [Usage](#usage)
  * [Registration](#registration)
  * [Create A List](#create-a-list)
  * [Add Item](#add-item)
  * [Check Item](#check-item)
  * [Drag Item](#drag-item)
  * [Invite User](#invite-user)
  * [Unintive User](#invite-user)
  * [Account Settings](#account-settings)
* [Roadmap](#roadmap)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)

## About The Project

<p align="center">
    <img src="https://user-images.githubusercontent.com/32650229/97107376-d99e3e80-16cf-11eb-8392-96284e9a340c.png" alt="Screenshot" width="640">
</p>

A simple and easy to use shopping list web application made with the MERN stack. Create a list and manage the items using your desired device before breezing through your favourite grocery store with your trusted web app open on your phone.

Hosted on EC2. <a href="https://marimetsola.com/kauppalappu" target="_blank">Click here to open the application.</a>

Record of working hours: <a href="time_used.md">Markdown file</a>, <a href="time_used.ods">OpenOffice file</a>

### List Of Features

* Create lists
* Add items to list
* Edit or delete items
* Drag and drop the items to change their order on the list
* Click on items to check them on and off
* Invite and uninvite other users to and from your lists
* Request a password reset email and follow the link to reset your password
* Change username, email and password in account settings
* Accept or decline list invitations in the account settings 

### Built With

* [React](https://reactjs.org)
* [Node](https://nodejs.org)
* [Express](https://expressjs.com)
* [MongoDB](https://www.mongodb.com)

## Usage

Listed below are the steps to use the main features of the application.

### Registration

Click the register button to open a modal for registration.
<p align="center">
    <img src="https://user-images.githubusercontent.com/32650229/97081953-a5167e00-160e-11eb-91a9-861d128e7e80.png" alt="Registration" width="640">
</p>
<br></br>
Fill in a username and a password and optionally an email address so you can reset your password in case you should forget it. Email can also be added later in the account settings.
<p align="center">
    <img src="https://user-images.githubusercontent.com/32650229/97118828-f5780380-1714-11eb-8829-a38290e3241b.png" alt="Registration" width="640">
</p>


### Create A List

Click the add list button to open up a modal to create a list.
<p align="center">
    <img src="https://user-images.githubusercontent.com/32650229/97118829-f6109a00-1714-11eb-92cb-209d449e3943.png" alt="Add list" width="640">
</p>

### Add Item

Click the add item button or press enter to open up a modal to add an item.
<p align="center">
    <img src="https://user-images.githubusercontent.com/32650229/97119180-1e999380-1717-11eb-8443-0b3f311af2c0.png" alt="Add item" width="640">
</p>

### Check Item

Click an item to check it on and off.
<p align="center">
    <img src="https://user-images.githubusercontent.com/32650229/97118835-f6a93080-1714-11eb-9821-119c512f10fa.png" alt="Click item" width="640">
</p>

### Drag Item

Drag and drop an item to move it to a different place on the list.
<p align="center">
    <img src="https://user-images.githubusercontent.com/32650229/97118822-f3ae4000-1714-11eb-84f7-fac5fc0aadc9.png" alt="Drag item" width="640">
</p>

### Invite User

Click the edit button to open a modal for the list's information and settings.
<p align="center">
    <img src="https://user-images.githubusercontent.com/32650229/97119151-f742c680-1716-11eb-9038-b648a21ece56.png" alt="Click edit" width="640">
</p>
<br></br>
Fill in a user's name and invite them to the list.
<p align="center">
    <img src="https://user-images.githubusercontent.com/32650229/97118824-f446d680-1714-11eb-81fa-04cafd4a87d7.png" alt="Invite user" width="640">
</p>

### Uninvite User

Click the X button to remove an invitation from a user.
<p align="center">
    <img src="https://user-images.githubusercontent.com/32650229/97118825-f4df6d00-1714-11eb-8796-1d8cbeee9c12.png" alt="Uninvite user" width="640">
</p>

### Account Settings

Click the account button on the navigation bar to access your settings. A red badge with a number will indicate the number of invitations you have to lists.
<p align="center">
    <img src="https://user-images.githubusercontent.com/32650229/97118826-f4df6d00-1714-11eb-972d-465f8073cd12.png" alt="Open profile" width="640">
</p>
<br></br>
You can change your username, email and password in the account settings in addition to accepting or declining any invitations to lists you might have.
<p align="center">
    <img src="https://user-images.githubusercontent.com/32650229/97118827-f5780380-1714-11eb-8cb2-26cd25a4f393.png" alt="Profile page" width="640">
</p>

## Roadmap

See about using WebSocket API to listen to changes made to lists by other users.

## Acknowledgements
* [Full Stack open 2020](https://fullstackopen.com/)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
* [TypeScript](https://www.typescriptlang.org/)
* [Formik](https://formik.org)
* [Semantic UI React](https://react.semantic-ui.com/)
* [Axios](https://github.com/axios/axios)
* [React-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
* [Nodemailer](https://nodemailer.com)
