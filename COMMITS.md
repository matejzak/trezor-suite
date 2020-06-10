# Commits conventios

Using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#specification) is recommended and might be enforced in future.

### Git hook

Use this git hook to auto-check your commit messages. Save the following snippet into `.git/hooks/commit-msg`


```
#!/usr/bin/env python
import re, sys, os

def main():
    # example:
    # feat(apikey): added the ability to add api key to configuration
    pattern = r'(build|ci|docs|feat|fix|perf|refactor|style|test|chore|revert)(\([\w\-]+\))?:\s.*'
    filename = sys.argv[1]
    ss = open(filename, 'r').read()
    m = re.match(pattern, ss)
    if m == None: raise Exception("conventional commit validation failed")

if __name__ == "__main__":
    main()
```

If you want to bypass commit-msg hook check, you may always use

```
git commit -m "foobar" --no-verify
```
