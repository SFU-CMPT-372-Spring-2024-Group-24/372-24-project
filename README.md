# SFU CMPT 372 Spring 2024 Group Project
## Getting started

Clone the repo:
```
git clone https://github.com/SFU-CMPT-372-Spring-2024-Group-24/372-24-project.git
```

## Development workflow
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

## 8. [Optional] Delete local and remote branch

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
