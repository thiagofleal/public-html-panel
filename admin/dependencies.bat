echo off
IF NOT EXIST vendor @MKDIR vendor
CD vendor/
CALL git clone https://github.com/thiagofleal/small-reactive small-reactive
CD small-reactive
CALL git fetch https://github.com/thiagofleal/small-reactive
CALL git checkout dev
CALL git pull https://github.com/thiagofleal/small-reactive dev
CALL git checkout 6b50bfe708242f39213ae7ec488a200cde2e89b7
call dependencies
CD ..
CD vendor/
CALL git clone https://github.com/thiagofleal/small-reactive-forms small-reactive/forms
CD small-reactive/forms
CALL git fetch https://github.com/thiagofleal/small-reactive-forms
CALL git checkout master
CALL git pull https://github.com/thiagofleal/small-reactive-forms master
CALL git checkout b0cfab798f22ce00b1748fa25789a9acdb671873
CD ..