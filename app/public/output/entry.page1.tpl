<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ name }}</title>
    <link rel="stylesheet" href="/static/normalize.css" />
    <link rel="icon" href="/static/logo.png" type="image/x-icon" />
  </head>
  <body style="color: red">
    <h1>page1</h1>
    <input id="env" value="{{ env }}" style="display: none" />
    <input id="options" value="{{ options }}" style="display: none" />
    <button onClick="handleClick()">发送请求</button>
  </body>
  <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
  <script type="text/javascript">
    try {
      window.env = document.getElementById("env").value;
      const options = document.getElementById("options").value;
      window.options = JSON.parse(options);
    } catch (e) {
      console.log(e);
    }

    const handleClick = () => {
      axios.get("/api/project/list").then((res) => {
        console.log(res.data);
      });
    };
  </script>
</html>
