# urlshortener
Backend code for URL shortener using nodejs, expressjs and mongodb

used validurl,shortid,dotenv,nodemon packages for this project 

validurl checks if the url is valid or not and nodemon is used to run the server without any disturbances
For shortening the URL we will generate a unique id using generate method of shortid package. Next, append baseURL with the unique id to generate a URL as a short URL. 
Also, as the short URL is generated for the first time we will mark the clikcCount to be zero. Save the document and return the result as JSON.

in database we store the longurl,shorturl,date,clickcounts 

we take the longurl when user access the server by shorturl then we redirect to it
