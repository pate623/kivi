# Kivi
Browser game which can be played on desktop and on mobile.

This game is built with LAMP stack but can be ran with any PHP and SQL database combination.

Internet is full of good and detailed tutorials on how to create an Ubuntu server so I'll be only listing the required steps.
1. Install Linux
2. Install Apache
3. Install MySQL
4. Install PHP
5. Install phpMyAdmin (highly recommended but not required)

And to get this game working on your system:
1. Make "public_html/kivi.html" file the starting page of your server.
2. Create MySQL database called "draftPickResults". 
3. Add the datatables from "kivi/draftPickResults.sql" to the "draftPickResults" database.
4. Add cron task "cronTasks/cronCleanGames.php", make it run once a minute.
5. Add cron task "cronTasks/cronCleanQueue.php", make it run once a minute.
6. Add servername, username and password for all(14) PHP files. <br>
These PHP files can be found from "cronTasks"(2), "public_html"(2), and "public_html\php"(10).<br>
These passwords can only seen by the server and are used to edit data in the SQL database. <br>
You can create new user accounts using phpMyAdmin.

---

<b>Starting Screen</b><br>
<img src="https://user-images.githubusercontent.com/53486622/161442327-df2e82b1-347f-4f8d-984c-7b8f2eda83ea.png" width="288" height="404" />

<b>In Game Screen</b><br>
<img src="https://user-images.githubusercontent.com/53486622/161442059-8a671eb3-d38b-4128-9178-7eeec914b2da.png" width="720" height="405" />

<b>End of Game Screen</b><br>
<img src="https://user-images.githubusercontent.com/53486622/161442137-cfba9754-9de0-4407-afcf-5d10cfe6e091.png" width="422" height="433" />

<b>Game History Browser</b><br>
<img src="https://user-images.githubusercontent.com/53486622/161442187-2a95c78d-9f69-4cb2-8f34-097b337e08f2.PNG" width="384" height="493" />

<b>Played Game Preview</b><br>
<img src="https://user-images.githubusercontent.com/53486622/161442217-9fca0e9d-3d4d-4a94-8324-96cbb634907e.PNG" width="417" height="462" />
