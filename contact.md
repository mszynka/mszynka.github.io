---
layout: redirect
section-type: section
title: Contact
slug: contact
order: 120
---
<div class="form-group">
	<div class="col-sm-6 col-xs-12">
		<h4>{{ site.title }}</h4>
		{% if site.email %}
			<span><a href="mailto:{{ site.email }}">{{ site.email }}</a></span>
		{% endif %}
	</div>
	<ul class="col-sm-6 col-xs-12">
		<h5>Social links:</h5>
		{% if site.github_username %}
			<div>
				{% include icon-social.html type="github" hasSecureLink="true" link="github.com" subdomain=site.github_username %}
			</div>
		{% endif %}
		{% if site.twitter_username %}
			<div>
				{% include icon-social.html type="twitter" hasSecureLink="true" link="twitter.com" subdomain=site.twitter_username %}
			</div>
		{% endif %}
		{% if site.linkedin_username %}
			<div>
				{% include icon-social.html type="linkedin" hasSecureLink="true" link="linkedin.com/in" subdomain=site.linkedin_username %}
			</div>
		{% endif %}
	</ul>
</div>