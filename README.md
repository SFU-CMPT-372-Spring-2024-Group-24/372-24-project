# SFU CMPT 372 Spring 2024 Group Project

## Getting started

Clone this repository:

```
git clone https://github.com/SFU-CMPT-372-Spring-2024-Group-24/372-24-project.git
```

### 1. Set up development environment

Change to the `backend/` directory.

> [!IMPORTANT]  
> **NEW! Set Up Google Cloud Storage**
>
> 1. Log onto https://console.cloud.google.com (make sure you're in the right project).
> 2. Go to IAM & Admin > Service Accounts > Create Service Account. Name the account and set the role to Cloud Storage > Storage Admin.
> 3. Note the email address of the account you just created. Request the bucket owner to add you via this email.
> 4. Select the account > Keys > Add key > Create new key > JSON > Create. This will download a JSON file. Place the file in `backend/ignore/`.
> 5. Update the `.env/` file like so:
> 
> ```
> GOOGLE_APPLICATION_CREDENTIALS=ignore/key-file.json
> GCLOUD_STORAGE_BUCKET=bucket-name
> ```

<del>
<p>
Generate a self-signed SSL certificate

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

This will create the `key.pem` and `cert.pem` files, which are your private key and certificate respectively.
</p>
</del>

Then, while still in the `backend/` directory, create a `.env` file with the following information:

```
PORT=8080

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=cmpt372project

SESSION_SECRET=your-secret

# FIREBASE_API_KEY=
# FIREBASE_AUTH_DOMAIN=
# FIREBASE_PROJECT_ID=
# FIREBASE_STORAGE_BUCKET=
# FIREBASE_MESSAGING_SENDER_ID=
# FIREBASE_APP_ID=
# FIREBASE_MEASUREMENT_ID=

GOOGLE_APPLICATION_CREDENTIALS=ignore/key-file.json
GCLOUD_STORAGE_BUCKET=bucket-name

NODE_ENV=development
```

### 2. Start PostgreSQL server

If you installed PostgreSQL with the official installer, the server should start automatically when you start your computer. Otherwise, you can start the server using your preferred method.

### 3. Start backend (port 8080)

Change to the `backend/` directory and run:

```bash
npm run dev
```

> [!IMPORTANT]  
> **Database migrations**
>
> When changes are made to a model, a database migration might be required. If you haven't already, initialize `sequelize`:
>
> ```bash
> npx sequelize-cli init
> ```
>
> By default, this will generate `models/index.js`, which you can remove because the content of this file is identical to `src/models/index.js`.
>
> Then, modify the details in `config/config.json` to reflect your database connection (similar to your `.env` file). `sequelize` will use this information to connect to the database and perform changes to it.
>
> Lastly, perform a database migration by running:
>
> ```
> npx sequelize-cli db:migrate
> ```

### 4. Start frontend (port 3000)

Change to the `frontend/` directory and run:

```
npm run dev
```

## Development workflow

> [!CAUTION]
> Make sure to perform a `git pull` and resolve any conflicts prior to pushing to the repository!

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

> [!CAUTION]
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

### 8. [OPTIONAL] Delete local and remote branch

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
