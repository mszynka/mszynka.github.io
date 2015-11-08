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
			{% include icon-github.html username=site.github_username %}
		</li>
	{% endif %}
	{% if site.twitter_username %}
		<li>
			{% include icon-twitter.html username=site.twitter_username %}
		</li>
	{% endif %}
	{% if site.email %}
	{% endif %}
</ul>
<div class="text-center">
	<p>{{ site.description }}</p>
</div>