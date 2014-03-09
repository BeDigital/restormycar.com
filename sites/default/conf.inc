<?php
include "/var/www/html/drupal_settings/restormycar.db.inc";
/* */
include "/var/www/html/drupal_settings/restor.memcache.inc";
#New Settings
  
  $conf['cache_backends'][] = 'sites/all/modules/memcache/memcache.inc';  
  $conf['cache_backends'][] = 'sites/all/modules/authcache/authcache.inc'; 

//overwrite page compression
$conf['page_compression'] = false;
