flight-launch-token-generator.html: flight-launch-token-generator.html.erb *.txt *.js
	ruby -rerb -rjson -e \
		"puts ERB.new(File.read('flight-launch-token-generator.html.erb')).result" \
		> flight-launch-token-generator.html

upload: flight-launch-token-generator.html
	aws s3 cp \
		--acl public-read \
		flight-launch-token-generator.html \
		s3://alces-flight-launch-token-generator/index.html

install: flight-launch-token-generator.html
	mkdir -p ../server/public/__admin__
	cp flight-launch-token-generator.html ../server/public/__admin__/token-generator.html
