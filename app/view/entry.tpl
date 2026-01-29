<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>{{ name }}</title>
    <link rel="stylesheet" href="/static/normalize.css" />
    <link rel="icon" href="/static/logo.png" type="image/x-icon" />
  </head>
  <body style="margin: 0">
    <div id="root"></div>
    <input id="env" value="{{ env }}" style="display: none" />
    <input id="options" value="{{ options }}" style="display: none" />
  </body>
  <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/js-md5@0.8.3/src/md5.min.js"></script>
  <script type="text/javascript">
    try {
      window.env = document.getElementById("env").value;
      const options = document.getElementById("options").value;
      window.options = JSON.parse(options);
    } catch (e) {
      console.log(e);
    }
  </script>
</html>
