BUCKET_NAME = ncucf-data
AWS = /usr/local/bin/aws

.PHONY: init-bucket update update-all upload clear-bucket

main: update

init-bucket:
	$(AWS) s3 cp ./data/ s3://$(BUCKET_NAME)/data/ --recursive --exclude '*/.gitkeep' --acl public-read
update:
	npm run update
update-all:
	npm run update-all
upload:
	$(AWS) s3 cp ./data/dynamic/all.json s3://$(BUCKET_NAME)/data/dynamic/all.json --acl public-read
clear-bucket:
	$(AWS) s3 rm s3://$(BUCKET_NAME)/ --recursive
