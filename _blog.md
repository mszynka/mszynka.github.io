---
layout: blog
section-type: section
title: the dev stories
slug: blog
order: -1
---
<ul class="post-list" style="list-style: none;">
  {% for post in site.posts %}
    <li>
      <h3>
      <span class="subheading mb-5" style="margin-right: 1rem">{{ post.date | date: "%Y-%m-%d" }}</span>
      <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>

      </h3>
    </li>
  {% endfor %}
</ul>
