#!/usr/bin bash

# alternative to the ps command inside docker container
for proc in /proc/*; do
    user=$(stat -c "%U" $proc)
    group=$(stat -c "%G" $proc)
    cmdline="$proc/cmdline"
    if [ -f $cmdline ]; then
        echo $user $(basename $(dirname $cmdline)) $(cat $cmdline | tr "\0" " ")
    fi
done
