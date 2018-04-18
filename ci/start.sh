#!/bin/bash

setEnv () {
    local NAME=$1;
    local VALUE=$2;
    if [ -n "$VALUE" ]
    then
        echo "$NAME: $VALUE"
        sed -i "s/var $NAME/var $NAME=\'${VALUE}\'/g" ./src/config.js
    fi
}

setEnv "ENV" "$ENV"
npm run build

if [ -d "/dist" ]
then
    echo "copy to dist"
    cp -R -f ./dist /dist/
fi
