flight-launch-token-generator.html: flight-launch-token-generator.html.erb *.txt
	ruby -rerb -rjson -e \
		"puts ERB.new(File.read('flight-launch-token-generator.html.erb')).result" \
		> flight-launch-token-generator.html

upload: flight-launch-token-generator.html
	aws s3 cp \
		--acl public-read \
		flight-launch-token-generator.html \
		s3://alces-flight-launch-token-generator/index.html
