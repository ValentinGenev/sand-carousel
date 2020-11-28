# Converts tabs to 2 spaces for GitHub
#
#!/bin/sh

file_tpes=( $1 ) # expects '"*.scss" "*.js"'
ident_size=$2

exec_for_files () {
	echo -e "\nLooking for $1"
	echo "Executed $2 for $1"
	echo "------------------"
	find . -wholename "$1" ! -type d -exec bash -c "$2" {} \;
}

replace_tabs_with_n_spaces () {
	expand -t $1 "$0" > /tmp/e && mv /tmp/e "$0"
}

# Makes the function executable in bash
export -f replace_tabs_with_n_spaces

echo -e "\nReplacing tabs with spaces"
for i in "${file_tpes[@]}"
do :
	echo $i
	exec_for_files "$i" "replace_tabs_with_n_spaces $ident_size"
done