# kivi
Browser game which can be played on desktop and on mobile.

This game is built with LAMP stack but can be ran with any PHP and SQL database combination.

Internet is full of good and detailed tuotrials on how to create an Ubuntu server so I'll be only listing the required steps.
1. Install linux
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
