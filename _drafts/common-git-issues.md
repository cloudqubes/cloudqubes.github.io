
#
```shell
git push -u origin main
```

gives error
```shell
error: src refspec main does not match any
error: failed to push some refs to 'github_personal:indikaimk/indikaimk.github.io.git'
```

Read the error. main does not match any. 
Need to check the branch.
```shell
git status
```

```shell
On branch master
nothing to commit, working tree clean
```

Change the branch name
```shell
git branch -m main
```
Now OK
```shell
git push -u origin main
Enumerating objects: 28, done.
Counting objects: 100% (28/28), done.
Delta compression using up to 8 threads
Compressing objects: 100% (26/26), done.
Writing objects: 100% (28/28), 351.09 KiB | 907.00 KiB/s, done.
Total 28 (delta 3), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (3/3), done.
To github_personal:indikaimk/indikaimk.github.io.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.

```

