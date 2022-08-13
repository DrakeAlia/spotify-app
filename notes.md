To Do:

-Log out button (X)

-Register button (X)

-Rename the project ()

-Chain the user image? ()

-If the user already is already logged in direct them to the main page ()

-https://spotify-app-jade.vercel.app/signin

-Check to see if they are already signed in and bring them to the main page ()

-Search and library and create a playlist, just stay coming soon ()

-Make the artist card clickable, so I can see the artist's songs ()


Cookie Goal:

1. Set the httpOnly value true (X)
2. Remove that code for removing cookie (X)
3. Tell the server the cookie is no longer valid (X)
4. Copy the route for signin or signup for the logout file (X)
5. Tell prisma to either delete or expire the cookie 

High level for what is going to the cookie:

1. The user comes to the site and makes a request (the cookie)
2. The server side responds and creates a cookie for the user and sends it back to the client side
3. The user on the client side now has the cookie
4. The client side holds onto that cookie untils it is deleted after the user logouts
5. Update - user sends a response to the server to update the cookie

Questions:
How can you see your route, to test if its working properly?

-----------------------------------------------------------------------------------------------------------------

Prisma steps for database and migrations:

1. npx prisma db push
2. npx prisma migration dev
3. Give migration a name

To check the db data:
npx prisma db seed

To check the db live:
npx prisma studio


http POST :3000/api/signup email=h@h.com password=abcabc

------------------------------------------------------------------------------------------------------------------

Where is the user being created in the server for this project?

Seed.ts

