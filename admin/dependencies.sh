#!/usr/bin/env bash
mkdir -p vendor/
cd vendor/
git clone https://github.com/thiagofleal/small-reactive small-reactive
cd small-reactive
git fetch https://github.com/thiagofleal/small-reactive && git checkout dev
git pull https://github.com/thiagofleal/small-reactive dev
git checkout 7b1a4ff6245dad13160b9056423f35f9a0f6abfa
sh dependencies.sh
cd ..
cd vendor/
git clone https://github.com/thiagofleal/small-reactive-forms small-reactive/forms
cd small-reactive/forms
git fetch https://github.com/thiagofleal/small-reactive-forms && git checkout master
git pull https://github.com/thiagofleal/small-reactive-forms master
git checkout b0cfab798f22ce00b1748fa25789a9acdb671873
cd ..