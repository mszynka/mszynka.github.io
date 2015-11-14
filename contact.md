---
layout: page
section-type: section
title: Contact
order: 120
---
<ul class="contact-list">
	<li>{{ site.title }}</li>
	<li><a href="mailto:{{ site.email }}">{{ site.email }}</a></li>
</ul>
<ul class="social-media-list">
	{% if site.github_username %}
		<li>
			{% include icon-social.html type="github" hasSecureLink="true" link="github.com" subdomain=site.github_username %}
		</li>
	{% endif %}
	{% if site.twitter_username %}
		<li>
			{% include icon-social.html type="twitter" hasSecureLink="true" link="twitter.com" subdomain=site.twitter_username %}
		</li>
	{% endif %}
	{% if site.email %}
	{% endif %}
</ul>
<div class="text-center">
	<p>{{ site.description }}</p>
</div>