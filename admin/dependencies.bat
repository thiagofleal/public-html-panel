echo off
IF NOT EXIST vendor @MKDIR vendor
CD vendor/
CALL git clone https://github.com/thiagofleal/small-reactive small-reactive
CD small-reactive
CALL git fetch https://github.com/thiagofleal/small-reactive
CALL git checkout beta
CALL git pull https://github.com/thiagofleal/small-reactive beta
CALL git checkout 8f87e7b23044a4d90f3d33c7bc341254aaf35971
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