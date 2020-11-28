# Before rebase:
#		- compiles code before rebase;
#		- turns tabs to spaces for the src/ files;
#		- commits the changes to the working branch.
#
#!/bin/sh

# Babel and SCSS scripts    
npm run compile

# GitHub like identation with spaces more
bash ./tabs-to-spaces.sh '*.scss *.js' 2

# Auto push latest changes
git add -A
git commit -m "[=] compilariton and sanitation complete;"