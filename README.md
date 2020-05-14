NCU-Course-Finder-DataFetcher-v2
================================

The new version of script to fetch and update the data for **NCU Course Finder**.

Introduction
------------

This is the data-fetching script for the project [NCU-Course-Finder-v5](https://github.com/zetaraku/NCU-Course-Finder-v5) and [NCU-Course-Finder-v4](https://github.com/zetaraku/NCU-Course-Finder-v4).

It uses [NCU Course Schedule Planning System](https://cis.ncu.edu.tw/) internal API to get the course data, and uses [NCU API](https://github.com/NCU-CC/API-Documentation) (NCU student & staff only) to get some extra data (course type).

Preparation
-----------

Make a copy of `.env.example` as `.env`.

To use the NCU API, you need to obtain the [NCU OAuth](https://api.cc.ncu.edu.tw/manage).

Put your NCU API Token into the `NCU_API_TOKEN` field in `.env`.

Run `npm install` to install the dependencies.

Initializing Data
-------------------

**This command requires NCU API.**

Use `npm run update-all` to initialize and update the whole database. (Run this maybe once a day.)

This command is required before using `npm run update`.

:warning: **Don't do this too frequently or you'll use up your NCU API access limit!**

Updating Data
-------------------

**You should at least run `npm run update-all` once before using this!**

Use `npm run update` to update the course data. (You can run this hourly.)

This command update the `course_bases` table described in `src/sql/init.sql`.

Serving Data
------------

Use `npm run serve` to start a server to serve the course data.

(You can change the serving port by modifying the `PORT` field in `.env`)

Uploading Data
--------------

You can also manually upload the data to somewhere else.

The course data is located at `data/dynamic/all.json`.

There is also a `Makefile` for uploading files to [Amazon S3](https://aws.amazon.com/tw/s3/); feel free to use it if you like.

License
-------

Copyright © 2020, Raku Zeta. Licensed under the MIT license.
