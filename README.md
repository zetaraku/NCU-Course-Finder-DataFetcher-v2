NCU-Course-Finder-DataFetcher-v2
================================

The new version of script to fetch and update the data for **NCU Course Finder**.

Introduction
------------

This is the data-fetching script for the project [NCU-Course-Finder-v6](https://github.com/zetaraku/NCU-Course-Finder-v6) and [NCU-Course-Finder-v4](https://github.com/zetaraku/NCU-Course-Finder-v4).

It uses [NCU Course Schedule Planning System](https://cis.ncu.edu.tw/) internal API to get the course data.

Preparation
-----------

- Make a copy of the `.env.example` file as `.env` and adjust it if needed.

- Run `npm install` to install the dependencies.

Update Course Data
-------------------

Use `npm run update` to update the course data.

This command updates the `course_bases` table described in `src/sql/init.sql`.

Upload Course Data
--------------

The course data is located at `data/dynamic/all.json`.

You can manually upload the data to somewhere else.

There is also a `./aws-uploader` using [AWS CLI](https://aws.amazon.com/cli/) to upload files to [Amazon S3](https://aws.amazon.com/tw/s3/); feel free to use it if you like.

License
-------

Copyright © 2020, Raku Zeta. Licensed under the MIT license.
