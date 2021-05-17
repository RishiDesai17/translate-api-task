# Steps for installation
## Requirements:
- Node.js version 14.x
- MySQL(with Xampp preferably) version 8.x

## Initial Steps:
- Make a .env file in the root of the project with the following attributes:
    ```
    DB=translationcache
    DB_HOST=localhost
    DB_USERNAME=Enter your MySQL username here
    DB_PASSWORD=Enter your MySQL password here
    DB_PORT=Enter port on which MySQL is running
    SUBSCRIPTION_KEY=Enter subscription key for azure translation service
    ```
- Create a new database in MySQL with the name "translationcache" and collation "utf8_general_ci" (v.imp.) as shown below:
    <img src="https://i.imgur.com/0giezfU.png" width="400" height="80">

## To run
- After you have completed the above steps, you can install dependecies and run the project (make sure your MySQL db is running on your computer on the port you entered in the .env file)<br>
    ```
    npm install
    npm run dev
    ```
- To access the translation API send a POST request to http://localhost:3000/api/translate
- The request body should contain 3 attributes:
    - text: a string which is to be translated(character limit is 200)
    - sourceLang: the code of the language in which your text is written
    - targetLang: the code of the language you want your text translated to<br>
  For example:
    ```
    {
        "text": "pen",
        "sourceLang": "en", // Language code for English
        "targetLang": "fr"  // Language code for French
    }
    ```

## To test
- Make sure your MySQL db is running on your computer on the port you entered in the .env file and you have installed all dependencies using "npm install"
- Then run the below command:<br>
    ```
    npm test
    ```

## If you have trouble running the project
- You can call the API on the deployed backend on heroku. Send a POST request to http://codeyoung-task.herokuapp.com/api/translate with the response body as mentioned above.

# Project explanation
- The database design consists of 2 tables:
    - The first table called "original" will contain the original text and its language, that was sent for translation
    - The second table called "translation" will contain the translation and its language, which will be linked to the original word in the "original" table via a foreign key.
    - 2 Indexes have been created for faster speed while searching. One of them is in the "original" table consisting of the originaltext and the lang(The language code) columns. Second index is in the "translation" table consisting of the originaltextid(The foreign key) and lang(The language code) columns.
- API logic
    - When the API is called, we will validate the inputs based on character limit and correct language code usage.
    - Then we will check if the given word and its translation is present in the database using a join. We can do this using two queries(one to the "original" table and after getting the id, we check it "translation" table) also but that would lead to an additional network call to the database.
    - If the required data is not present in the database, then we call the translation service API.
- Caching and Pre-caching
    - We can cache the current data and pre-cache related languages after the response is sent back to the user.
    - First we insert the original word to the "original" table.
    - Then after we get the primary key of this newly generated row. We will cache the translation of requested language and its related language to the "translation" table.
    - We determine related language by the sample object given in constants/index.js, In this file I have clubbed some south-asian and european languages. This can be extended to more languages and more regions.
    - These above queries are made as part of a transaction, so that if anything goes wrong, we can rollback in the catch block.
    ### Potential improvements
    - After sending the response, we could run the caching and pre-caching logic as a child process. That way this duty can be handled by another core, and the event loop has lesser burden.
    - Redis is a good alternative for caching.
