parts install php5 php5-apache2
parts stop apache2&
parts start apache2&
ungit --port=9501&
npm install
grunt dev