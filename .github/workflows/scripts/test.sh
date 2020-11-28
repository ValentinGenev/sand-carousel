# Converts tabs to 2 spaces for GitHub
#
#!/bin/sh

filesInDist=$(find ./dist -maxdepth 1 -type f|wc -l)

if (( $filesInDist > 2 )); then
	echo "Distribution files are present."
else
	echo "Files not found."
fi