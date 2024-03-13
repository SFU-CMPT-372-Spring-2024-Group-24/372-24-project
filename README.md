# SFU CMPT 372 Spring 2024 Group Project

## Getting started

Clone the repo:
```
git clone https://github.com/SFU-CMPT-372-Spring-2024-Group-24/372-24-project.git
```

### 1. Set up development environment

Change to the `backend/` directory.

Generate a self-signed SSL certificate:
```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

This will create the `key.pem` and `cert.pem` files, which are your private key and certificate respectively.

Then, while still in the `backend/` directory, create a `.env` file with the following information:

```bash
PORT=8080

DB_HOST=<your_db_host> # e.g. localhost
DB_PORT=<your_db_port> # e.g. 5432
DB_USERNAME=<your_db_username> # e.g postgres
DB_PASSWORD=<your_password> # e.g postgres
DB_NAME=cmpt372project

SSL_KEY_PATH=./key.pem
SSL_CERT_PATH=./cert.pem
```


### 2. Start PostgreSQL server process

#### Postgres.app

I would recommend using the postgres.app because you can easily manage and keep track of running postgres instances.

  Download link: https://postgresapp.com

  For the server password, make sure to it matches the DB_PASSWORD in your .env file.

> [!NOTE]
> If you have any conflict about port being already in use, check if there is any postgres instance running on port 5432, kill that process, or simply change the port `DB_PORT` in the .env file

#### Postico 2

Also, if you want to easily see table records using a graphical tool, I would recommend download Postico 2

  Download link: https://eggerapps.at/postico2/

  Create a new server and enter the credentials same as your .env file (the DB_*).

  Then you would be able to retrive table data with one click! (You can also directly put SQL commands in the app using its integrated terminal)

### 3. Start the server (port 8080)

In the backend directory:

run `npm run dev` for running server using nodemon

or:

run `npm start` for running server using node

> If you want to test out API, use port 8080 on Postman

### 4. Start the client (port 3000)

In the frontend directory:

run `npm run dev`

> Go to `http://localhost:3000` on your browser to view the app

## Development workflow

> [!NOTE]
> Remember to do a `git pull` to make sure your local project directory is up to date with our repo before you start coding!

### 1. Create a feature branch

Create a new branch:
```
git checkout -b [branch-name]
```

Query current branches:
```
git branch
```

Switch to another branch:
```
git checkout [branch-name]
```

### 2. [OPTIONAL] Open an issue on GitHub web interface for the developing feature

### 3. Write code on your local machine

### 4. Make a commit (locally)
```
git add .                  # stage files (new, modified, deleted, equivalent to `git add -A`)
git commit -m "[Comment]"  # write a reasonable commit log
```
> [!NOTE]
> In the commit message, mention the issue number # of the issue created in step 2 (if any).

### 5. Sync with the main branch and resolve conflicts
```
git checkout main              # switch to the local main 
git pull                       # pull from remote main branch
git checkout [branch name]     # switch to the feature branch
git merge main                 # merge diff from main
```
> [!WARNING]
> Resolve conflicts and errors before pushing to the remote repo.

### 6. Push to the remote feature branch
If it is the first time you're pushing to the remote, additional parameters are needed:
```
git checkout [branch name]            # switch to the feature branch
git push -u origin [branch name]      # create a new feature branch in the upstream and push
```
Otherwise:
```
git checkout [branch name]                     # switch to the feature branch
git push                                       # push from local to remote feature branch
```

### 7. Pull request and Merge
1. Switch to the GitHub web interface
2. Select the `branch name` you would like to merge to main
3. Click `New pull request` button
4. Type in the pull request title and comment
5. Ask someone to review and approve the pull request

### 8. [Optional] Delete local and remote branch

Once the branch is merged, we may delete the feature branch:

Delete a local branch:
```
git branch -d [branch name]
```
Delete a remote branch:
```
git push origin --delete [branch name]
```
Alternatively, you can use a web interface to delete a remote branch

## Delete files from Git repo

### Step 1 - Remove and commit
If you need to remove a file from both git repo and local filesystem:
```
git rm [filename]
```
If you only want to remove a file from git repo (and keep the local copy):
```
git rm --cached [filename]
```

### Step 2 - Push to the remote repo
```
git push
```

## Other useful Git usage

### Rename a local branch
```
git branch -m <oldname> <newname>
```

Feel free to add more to this section whatever you think we may need.
